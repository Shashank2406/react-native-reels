// packages Imports
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Dimensions, Text, Pressable} from 'react-native';
import Video from '../../../../react-native-video';

import Buttons from './Buttons';
import Header from './Header';
import helper from '../utils/helper';
// Screen Dimensions
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

function ReelCard({
  uri,
  _id,
  ViewableItem,
  liked = false,
  disliked = false,
  index,

  // Container Props
  backgroundColor = 'black',

  // Header Props
  headerTitle = 'Reels',
  headerIconName,
  headerIconColor,
  headerIconSize,
  headerIcon,
  headerComponent,
  onHeaderIconPress = () => {},

  // Options Props
  optionsComponent,
  pauseOnOptionsShow = true,
  onSharePress = () => {},
  onCommentPress = () => {},
  onLikePress = () => {},
  onDislikePress = () => {},

  // Player Props
  onFinishPlaying = () => {},

  // Slider Props
  minimumTrackTintColor = 'white',
  maximumTrackTintColor = 'grey',
  thumbTintColor = 'white',

  // Time Props
  timeElapsedColor = 'white',
  totalTimeColor = 'white',
}) {
  // ref for Video Player
  const VideoPlayer = useRef(null);

  // States
  const [VideoDimensions, SetVideoDimensions] = useState({
    width: ScreenWidth,
    height: ScreenWidth,
  });
  const [Progress, SetProgress] = useState(0);
  const [Duration, SetDuration] = useState(0);
  const [Paused, SetPaused] = useState(false);
  const [ShowOptions, SetShowOptions] = useState(false);

  // Play/Pause video according to viisibility
  useEffect(() => {
    if (ViewableItem === _id) SetPaused(false);
    else SetPaused(true);
  }, [ViewableItem]);

  // Pause when use toggle options to True
  useEffect(() => {
    if (pauseOnOptionsShow) {
      if (ShowOptions) SetPaused(false);
      else SetPaused(false);
    }
  }, [ShowOptions, pauseOnOptionsShow]);

  // Callbhack for Seek Update
  const SeekUpdate = useCallback(
    async seekTime => {
      try {
        if (VideoPlayer.current)
          VideoPlayer.current.seek((seekTime * Duration) / 100 / 1000);
      } catch (error) {}
    },
    [Duration, ShowOptions],
  );

  // Callback for PlayBackStatusUpdate
  const PlayBackStatusUpdate = playbackStatus => {
    try {
      let currentTime = Math.round(playbackStatus.currentTime);
      let duration = Math.round(playbackStatus.seekableDuration);
      if (currentTime)
        if (duration) SetProgress((currentTime / duration) * 100);
    } catch (error) {}
  };

  // function for getting video dimensions on load complete
  const onLoadComplete = event => {
    const {naturalSize} = event;

    try {
      const naturalWidth = naturalSize.width;
      const naturalHeight = naturalSize.height;
      if (naturalWidth > naturalHeight) {
        SetVideoDimensions({
          width: ScreenWidth,
          height: ScreenWidth * (naturalHeight / naturalWidth),
        });
      } else {
        SetVideoDimensions({
          width: ScreenHeight * (naturalWidth / naturalHeight),
          height: ScreenHeight,
        });
      }
      SetDuration(event.duration * 1000);
    } catch (error) {}
  };

  // function for showing options
  const onMiddlePress = async () => {
    try {
      SetShowOptions(!ShowOptions);
    } catch (error) {}
  };

  // fuction to Go back 10 seconds
  const onFirstHalfPress = async () => {
    try {
      if (VideoPlayer.current) {
        let toSeek = Math.floor((Progress * Duration) / 100) / 1000;
        if (toSeek > 10) VideoPlayer.current.seek(toSeek - 10);
      }
    } catch (error) {}
  };

  // fuction to skip 10 seconds
  const onSecondHalfPress = async () => {
    try {
      if (VideoPlayer.current) {
        let toSeek = Math.floor((Progress * Duration) / 100) / 1000;
        VideoPlayer.current.seek(toSeek + 10);
      }
    } catch (error) {}
  };

  // Manage error here
  const videoError = error => {};

  // useMemo for Options
  const GetButtons = useMemo(
    () => (
      <View style={styles.OptionsContainer}>
        {optionsComponent ? null : (
          <>
            <Buttons
              name={'like'}
              text="12.1k"
              color={liked ? 'dodgerblue' : 'white'}
              onPress={() => onLikePress(_id)}
            />
            <Buttons
              name={'share'}
              text="13.9k"
              color={disliked ? 'dodgerblue' : 'white'}
              onPress={() => onDislikePress(_id)}
            />
            <Buttons
              name={'volume'}
              text=""
              color={disliked ? 'dodgerblue' : 'white'}
              onPress={() => onDislikePress(_id)}
            />
            <Buttons
              name={"play"}
              text=""
              onPress={() => onCommentPress(_id)}
            />
          </>
        )}
      </View>
    ),
    [ShowOptions, optionsComponent, liked, disliked],
  );
  const GetText = useMemo(
    () => (
      <View style={styles.textContainer}>
        {optionsComponent ? null : (
          <>
           <Text style={styles.textHeaderStyle}>Lorium Lipsum</Text>
           <Text style={styles.textStyle}>Lorium Lisum scores a goal...</Text>
          </>
        )}
      </View>
    ),
    [ShowOptions, optionsComponent, liked, disliked],
  );

  return (
    <Pressable
      style={[styles.container, {backgroundColor: backgroundColor}]}
      onPress={onMiddlePress}>
      <Pressable style={styles.FirstHalf} onPress={onFirstHalfPress} />
      <Pressable style={styles.SecondHalf} onPress={onSecondHalfPress} />
      <Video
        ref={VideoPlayer}
        source={uri}
        style={VideoDimensions}
        resizeMode="contain"
        onError={videoError}
        playInBackground={false}
        progressUpdateInterval={1000}
        paused={Paused}
        muted={true}
        repeat={true}
        onLoad={onLoadComplete}
        onProgress={PlayBackStatusUpdate}
        onEnd={() => onFinishPlaying(index)}
      />

      {ShowOptions ? (
        <>
          {GetButtons}
          {GetText}
        </>
      ) : null}
    </Pressable>
  );
}

// Exports
export default ReelCard;

// Stylesheet
const styles = StyleSheet.create({
  container: {
    width: ScreenWidth,
    height: ScreenHeight,
    justifyContent: 'center',
  },
  SliderContainer: {
    position: 'absolute',
    width: ScreenWidth,
    height: 55,
    bottom: 0,
    zIndex: 100,
  },
  TimeOne: {
    color: 'grey',
    position: 'absolute',
    left: 15,
    fontSize: 13,
    bottom: 5,
  },
  TimeTwo: {
    color: 'grey',
    position: 'absolute',
    right: 15,
    fontSize: 13,
    bottom: 5,
  },
  OptionsContainer: {
    position: 'absolute',
    right: 10,
    bottom: 100,
    zIndex: 100,
  },
  textContainer: {
    position: 'absolute',
    left: 20,
    bottom: 130,
    zIndex: 100,
  },
  HeaderContainer: {
    position: 'absolute',
    width: ScreenWidth,
    top: 0,
    height: 50,
    zIndex: 100,
  },
  FirstHalf: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: ScreenWidth * 0.25,
    height: ScreenHeight,
    zIndex: 99,
  },
  SecondHalf: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: ScreenWidth * 0.25,
    height: ScreenHeight,
    zIndex: 99,
  },
  textHeaderStyle: {
    color: '#ffff',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  textStyle: {
    color: '#ffff',
    fontSize: 10,
    marginTop: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  }
});
