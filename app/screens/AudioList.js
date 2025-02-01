import { Text, View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import React, { Component, } from 'react';
import { AudioContext } from '../context/AudioProvider';
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';
import AudioListItem from '../components/AudioListItem';
import OptionModal from '../components/OptionModal';
import { Audio } from 'expo-av';
import { play, pause, resume, playNext } from '../misc/audioController';

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
    };

    this.currentItem = {};
  }

  layoutProvider = new LayoutProvider(
    (i) => 'audio',
    (type, dim) => {
      switch (type) {
        case 'audio':
          dim.width = Dimensions.get('window').width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  onPlaybackStatusUpdate = async playbackStatus => {
    if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
      this.context.updateState(this.context, {
        playbackPosition: playbackStatus.positionMillis,
        playbackDuration: playbackStatus.durationMillis,
      });
    }
    // console.log(playbackStatus.didJustFinish);

    if (playbackStatus.didJustFinish) {
      const nextAudioIndex = this.context.currentAudioIndex + 1;
      if (nextAudioIndex >= this.context.totalAudioCount) {
        this.context.playbackObj.unloadAsync();
        return this.context.updateState(this.context, {
          soundObj: null,
          currentAudio: this.context.audioFiles[0],
          isPlaying: false,
          currentAudioIndex: [0],
          playbackPosition: null,
          playbackDuration: null,
        });
      }
      const audio = this.context.audioFiles[nextAudioIndex];
      const status = await playNext(this.context.playbackObj, audio.uri)
      this.context.updateState(this.context, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: nextAudioIndex,
      });
    }
  };

  handleAudioPress = async (audio) => {
    const { playbackObj, soundObj, currentAudio, updateState, audioFiles } = this.context;

    // play audio for the first time
    if (soundObj === null) {
        const playbackObj = new Audio.Sound();
        const status = await play(playbackObj, audio.uri);
        const index = audioFiles.indexOf(audio);
        console.log("playback object after first play:", playbackObj);
        updateState(this.context, {
            currentAudio: audio,
            playbackObj: playbackObj,
            soundObj: status,
            isPlaying: true,
            currentAudioIndex: index,
        });
        return playbackObj.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
    }

    // pause audio
    if (soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id) {
        const status = await pause(playbackObj);
        console.log("playback object after pause:", playbackObj);
        return updateState(this.context, { soundObj: status, isPlaying: false });
    }

    // resume audio
    if (soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id) {
        const status = await resume(playbackObj);
        console.log("playback object after resume:", playbackObj);
        return updateState(this.context, { soundObj: status, isPlaying: true });
    }

    // select another audio
    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
        console.log("Stopping and unloading current audio...");
        await playbackObj.stopAsync();
        await playbackObj.unloadAsync();
        console.log("Current audio stopped and unloaded.");

        const status = await playNext(playbackObj, audio.uri);
        const index = audioFiles.indexOf(audio);
        console.log("playback object after play next:", playbackObj);
        updateState(this.context, {
            currentAudio: audio,
            soundObj: status,
            isPlaying: true,
            currentAudioIndex: index,
        });
        return playbackObj.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
    }
};

rowRenderer = (type, item, index, extendedState) => {
    return (
        <AudioListItem
            title={item.filename}
            isPlaying={extendedState.isPlaying}
            activeListItem={this.context.currentAudioIndex === index}
            duration={item.duration}
            onAudioPress={() => this.handleAudioPress(item)}
            onOptionPress={() => {
                this.currentItem = item;
                this.setState({ ...this.state, optionModalVisible: true });
            }}
        />
    );
};

render() {
    return (
        <AudioContext.Consumer>
            {({ dataProvider, isPlaying }) => {
                return (
                    <View style={styles.container}>
                        <RecyclerListView
                            dataProvider={dataProvider}
                            layoutProvider={this.layoutProvider}
                            rowRenderer={this.rowRenderer}
                            extendedState={{ isPlaying }}
                            style={styles.recyclerView}
                        />
                        <OptionModal
                            onPlayPress={this.context.play}
                            onPlayListPress={() =>
                                this.props.navigation.navigate('PlayList', { item: this.currentItem })
                            }
                            currentItem={this.currentItem}
                            onclose={() => this.setState({ ...this.state, optionModalVisible: false })}
                            visible={this.state.optionModalVisible}
                        />
                    </View>
                );
            }}
        </AudioContext.Consumer>
    );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  recyclerView: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
});

export default AudioList;