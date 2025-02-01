import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import color from '../misc/color';

const AudioListItem = ({ title, duration, onOptionPress, onAudioPress }) => {
  const convertTime = (minutes) => {
    if (minutes) {
      const hrs = minutes / 60;
      const minute = hrs.toString().split('.')[0];
      const percent = parseInt(hrs.toString().split('.')[1].slice(0, 2));
      const sec = Math.ceil((60 * percent) / 100);

      if (parseInt(minute) < 10 && sec < 10) {
        return `0${minute}:0${sec}`;
      }

      if (parseInt(minute) < 10) {
        return `0${minute}:${sec}`;
      }

      if (sec < 10) {
        return `${minute}:0${sec}`;
      }

      return `${minute}:${sec}`;
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={onAudioPress}>
        <View style={styles.container}>
          <View style={styles.leftContainer}>
            <View style={styles.thumbnail}>
              <Text style={styles.thumbnailText}>{title[0]}</Text>
            </View>
            <View style={styles.titleContainer}>
              <Text numberOfLines={1} style={styles.title}>{title}</Text>
              <Text style={styles.time}>{convertTime(duration)}</Text>
            </View>
          </View>
          <View style={styles.rightContainer}>
            <Entypo 
              onPress={onOptionPress}
              name="dots-three-vertical" 
              size={18} 
              color={color.FONT_MEDIUM}
              style={{ padding: 10 }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.separator} />
    </>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  thumbnail: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: color.FONT_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: color.FONT,
  },
  titleContainer: {
    width: width - 180,
    paddingLeft: 10,
  },
  title: {
    fontSize: 16,
    color: color.FONT,
  },
  time: {
    fontSize: 14,
    color: color.FONT_LIGHT,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    width: width - 80,
    backgroundColor: '#E0E0E0',
    height: 1,
    alignSelf: 'center',
    marginTop: 10,
  },
});

export default AudioListItem;