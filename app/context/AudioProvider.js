import { Text, View, Alert } from 'react-native';
import React, { Component, createContext } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { DataProvider } from 'recyclerlistview';

export const AudioContext = createContext();
export class AudioProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioFiles: [],
      permissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObj: null,
      soundObj: null,
      currentAudio: {},
      isPlaying: false,
      currentAudioIndex: null,
      playbackPosition: null,
      playbackDuration: null,
    };
    this.totalAudioCount = 0;
  }

  permissionAlert = () => {
    Alert.alert('Permission Required', 'This app needs to read audio files!', [
      {
        text: 'Give Permission',
        onPress: () => this.getPermission(),
      },
      {
        text: 'Cancel',
        onPress: () => this.permissionAlert(),
      },
    ]);
  };

  getAllSongs = async () => {
    const { dataProvider, audioFiles } = this.state;
    let media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
    });
    media = await MediaLibrary.getAssetsAsync({
      mediaType: 'audio',
      first: media.totalCount,
    });
    this.totalAudioCount = media.totalCount;

    this.setState({
      ...this.state,
      dataProvider: dataProvider.cloneWithRows([...audioFiles, ...media.assets]),
      audioFiles: [...audioFiles, ...media.assets],
    });
  };

  getPermission = async () => {
    const permission = await MediaLibrary.getPermissionsAsync();
    if (permission.granted) {
      return this.getAllSongs();
    }
    if (!permission.canAskAgain) {
      return;
    }
    const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();

    if (status === 'denied' && canAskAgain) {
      this.permissionAlert();
      if (status === 'granted') {
        return this.getAllSongs();
      }
    }
    if (status === 'denied' && !canAskAgain) {
      this.setState({ ...this.state, permissionError: true });
    }
  };

  componentDidMount() {
    this.getPermission();
    this.interval = setInterval(this.updatePlaybackPosition, 1000);

    if (this.state.playbackObj) {
      this.state.playbackObj.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updatePlaybackPosition = () => {
    if (this.state.playbackObj && this.state.isPlaying) {
      this.state.playbackObj.getStatusAsync().then((status) => {
        if (status.isLoaded) {
          this.setState({
            playbackPosition: status.positionMillis,
            playbackDuration: status.durationMillis,
          });
        }
      });
    }
  };

  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState });
  };

  render() {
    const {
      audioFiles,
      dataProvider,
      permissionError,
      playbackObj,
      soundObj,
      currentAudio,
      isPlaying,
      currentAudioIndex,
      playbackPosition,
      playbackDuration,
    } = this.state;
    if (permissionError)
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 25, textAlign: 'center' }}>
            It looks like you haven't accept the permission.
          </Text>
        </View>
      );
    return (
      <AudioContext.Provider
        value={{
          audioFiles,
          dataProvider,
          playbackObj,
          soundObj,
          currentAudio,
          isPlaying,
          currentAudioIndex,
          totalAudioCount: this.totalAudioCount,
          playbackPosition,
          playbackDuration,
          updateState: this.updateState,
        }}
      >
        {this.props.children}
      </AudioContext.Provider>
    );
  }
}

export default AudioProvider;