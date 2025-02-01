import { View, Text, StyleSheet, Dimensions } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import color from '../misc/color';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProvider';

const { width } = Dimensions.get('window');

const Player = () => {
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration, isPlaying, currentAudioIndex, totalAudioCount, currentAudio } = context;

  const [position, setPosition] = useState(playbackPosition);
  const [duration, setDuration] = useState(playbackDuration);

  useEffect(() => {
    setPosition(playbackPosition);
    setDuration(playbackDuration);
  }, [playbackPosition, playbackDuration]);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setPosition((prevPosition) => prevPosition + 1000); // Update every second
      }, 1000);
    } else if (!isPlaying && position !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const calculateSeekBar = () => {
    if (position !== null && duration !== null) {
      return position / duration;
    }
    return 0;
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
          thumbTintColor={color.ACTIVE_BG}
        />
        <View style={styles.audioControllers}>
          <PlayerButton iconType="PREV" onPress={() => alert('prev')} />
          <PlayerButton
            style={{ marginHorizontal: 25 }}
            iconType={isPlaying ? 'PAUSE' : 'PLAY'}
            onPress={() => alert('play/pause')}
            size={50}
          />
          <PlayerButton iconType="NEXT" onPress={() => alert('next')} />
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
});

export default Player;