import React, { useContext, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import color from '../misc/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProvider';
import { pause, resume, playNext, rewind, playPrevious } from '../misc/audioController';

const { width } = Dimensions.get('window');

const formatTime = (milliseconds) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = ((milliseconds % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const Player = () => {
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration, isPlaying, currentAudioIndex, totalAudioCount, currentAudio, playbackObj, audioFiles, updateState } = context;
  const [lastTapTime, setLastTapTime] = useState(0);
  const DOUBLE_TAP_DELAY = 300; // 300ms window for double tap

  const calculateSeekBar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }
    return 0;
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      const status = await pause(playbackObj);
      updateState(context, { soundObj: status, isPlaying: false });
    } else {
      const status = await resume(playbackObj);
      updateState(context, { soundObj: status, isPlaying: true });
    }
  };

  const handleNext = async () => {
    const nextAudioIndex = currentAudioIndex + 1;
    if (nextAudioIndex >= totalAudioCount) return;
    const audio = audioFiles[nextAudioIndex];
    const status = await playNext(playbackObj, audio.uri);
    updateState(context, {
      soundObj: status,
      currentAudio: audio,
      isPlaying: true,
      currentAudioIndex: nextAudioIndex,
    });
  };

  const handlePrev = async () => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;

    if (playbackPosition > 5000) { // More than 5 seconds into song
      if (tapLength < DOUBLE_TAP_DELAY) {
        // Double tap - play previous song
        const prevAudioIndex = currentAudioIndex - 1;
        if (prevAudioIndex < 0) return;
        
        const audio = audioFiles[prevAudioIndex];
        const status = await playPrevious(playbackObj, audio.uri);
        updateState(context, {
          soundObj: status,
          currentAudio: audio,
          isPlaying: true,
          currentAudioIndex: prevAudioIndex,
        });
      } else {
        // Single tap - restart current song
        const status = await rewind(playbackObj);
        updateState(context, {
          soundObj: status,
        });
      }
    } else { // 5 seconds or less into song
      // Play previous song
      const prevAudioIndex = currentAudioIndex - 1;
      if (prevAudioIndex < 0) return;
      
      const audio = audioFiles[prevAudioIndex];
      const status = await playPrevious(playbackObj, audio.uri);
      updateState(context, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: prevAudioIndex,
      });
    }

    setLastTapTime(currentTime);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.audioCount}>{`${currentAudioIndex + 1} / ${totalAudioCount}`}</Text>
      <View style={styles.midBannerContainer}>
        <MaterialCommunityIcons
          name="music-circle"
          size={300}
          color={isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM}
        />
      </View>
      <View style={styles.audioPlayerContainer}>
        <Text numberOfLines={1} style={styles.audioTitle}>
          {currentAudio.filename}
        </Text>

        <Slider
          style={{ width: width, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={calculateSeekBar()}
          minimumTrackTintColor={color.ACTIVE_BG}
          maximumTrackTintColor={color.FONT_MEDIUM}
        />
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(playbackPosition)}</Text>
          <Text style={styles.timeText}>{formatTime(playbackDuration)}</Text>
        </View>
        <View style={styles.audioControllers}>
          <PlayerButton iconType="PREV" onPress={handlePrev} />
          <PlayerButton
            style={{ marginHorizontal: 25 }}
            iconType={isPlaying ? 'PLAY' : 'PAUSE'}
            onPress={handlePlayPause}
            size={50}
          />
          <PlayerButton iconType="NEXT" onPress={handleNext} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  audioControllers: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  container: {
    flex: 1,
  },
  audioCount: {
    textAlign: 'right',
    padding: 15,
    color: color.FONT_LIGHT,
    fontSize: 14,
    fontWeight: 'bold',
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioTitle: {
    fontSize: 16,
    color: color.FONT,
    padding: 15,
    textAlign: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  timeText: {
    color: color.FONT_LIGHT,
    fontSize: 14,
  },
});

export default Player;