import React from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';

import Share from '../assets/share.svg'
import Volume from '../assets/volume.svg'
import Heart from '../assets/heart.svg'
import Play from '../assets/play.svg'
import { BlurView } from '@react-native-community/blur';


function Buttons({
  customComponent,
  name = 'like2',
  text = 'Like',
  color = 'white',
  size = 30,
  onPress,
}) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {customComponent ? (
        customComponent
      ) : (
        <View>
          {
            name != 'play' &&  <BlurView
            style={styles.blurViewStyle}
            blurType='light'
            blurAmount={1}
            blurRadius={1}
        >
          {name === 'like' && <Heart/>}
          {name === 'share' && <Share/>}
          {name === 'volume' && <Volume/>}
          </BlurView>
          }
         
        { (name != 'play' && text.length > 0) && <Text style={{marginTop: 10, fontWeight: 'bold', color: 'white'}}>
            {text}
          </Text> }
          {name === 'play' && <Play/>}
        </View>
         
      )}
    </Pressable>
  );
}

export default Buttons;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
    marginRight: 15,
  },
  blurViewStyle: {
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
