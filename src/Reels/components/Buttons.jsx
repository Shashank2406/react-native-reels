import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';

import Mute from '../assets/mute.svg';
import Play from '../assets/play.svg';
import Share from '../assets/share.svg';
import Heart from '../assets/heart.svg';
import Volume from '../assets/volume.svg';
import { BlurView } from '@react-native-community/blur';

function Buttons({
  isMute,
  onPress,
  size = 30,
  text = 'Like',
  name = 'like2',
  color = 'white',
  customComponent,
}) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {customComponent ? (
        customComponent
      ) : (
        <View>
          {name != 'play' && (
            <BlurView
              blurAmount={1}
              blurRadius={1}
              blurType='light'
              style={styles.blurViewStyle}
            >
              {name === 'like' && <Heart />}
              {name === 'share' && <Share />}
              {name === 'volume' && (isMute ? <Mute /> : <Volume />)}
            </BlurView>
          )}

          {name != 'play' && text.length > 0 && (
            <Text style={{ marginTop: 10, fontWeight: 'bold', color: 'white' }}>
              {text}
            </Text>
          )}
          {name === 'play' && <Play />}
        </View>
      )}
    </Pressable>
  );
}

export default Buttons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: 15,
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blurViewStyle: {
    width: 40,
    height: 40,
    padding: 10,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
