// packages Imports
import React, {
  useRef,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { View, StyleSheet, Dimensions, Text, Pressable } from 'react-native';

import Header from './Header';
import Buttons from './Buttons';
import helper from '../utils/helper';
import Video from '../../../../react-native-video';

// Screen Dimensions
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

function ReelCard({
  uri,
  _id,
  title,
  index,
  muted,
  description,
  ViewableItem,
  liked = false,
  textTitleStyle,
  disliked = false,
  textDescriptionStyle,

  // Container Props
  backgroundColor = 'black',

  // Header Props
  headerIcon,
  headerIconName,
  headerIconColor,
  headerIconSize,
  headerComponent,
  headerTitle = 'Reels',
  onHeaderIconPress = () => {},

  // Options Props
  optionsComponent,
  onLikePress = () => {},
  onSharePress = () => {},
  onVolumePress = () => {},
  pauseOnOptionsShow = true,
  onCommentPress = () => {},
  onDislikePress = () => {},

  // Player Props
  onFinishPlaying = () => {},

  // Slider Props
  thumbTintColor = 'white',
  maximumTrackTintColor = 'grey',
  minimumTrackTintColor = 'white',

  // Time Props
  totalTimeColor = 'white',
  timeElapsedColor = 'white',
}) {
  // ref for Video Player
  const VideoPlayer = useRef(null);

  // States
  const [Progress, SetProgress] = useState(0);
  const [Duration, SetDuration] = useState(0);
  const [Paused, SetPaused] = useState(false);
  const [ShowOptions, SetShowOptions] = useState(false);
  const [VideoDimensions, SetVideoDimensions] = useState({
    width: ScreenWidth,
    height: ScreenWidth,
  });

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
    async (seekTime) => {
      try {
        if (VideoPlayer.current)
          VideoPlayer.current.seek((seekTime * Duration) / 100 / 1000);
      } catch (error) {}
    },
    [Duration, ShowOptions]
  );

  // Callback for PlayBackStatusUpdate
  const PlayBackStatusUpdate = (playbackStatus) => {
    try {
      let currentTime = Math.round(playbackStatus.currentTime);
      let duration = Math.round(playbackStatus.seekableDuration);
      if (currentTime)
        if (duration) SetProgress((currentTime / duration) * 100);
    } catch (error) {}
  };

  // function for getting video dimensions on load complete
  const onLoadComplete = (event) => {
    const { naturalSize } = event;

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
  const videoError = (error) => {};

  // useMemo for Options
  const GetButtons = useMemo(
    () => (
      <View style={styles.OptionsContainer}>
        {optionsComponent ? null : (
          <>
            <Buttons
              text='12.1k'
              name={'like'}
              onPress={() => onLikePress(_id)}
              color={liked ? 'dodgerblue' : 'white'}
            />
            <Buttons
              text='13.9k'
              name={'share'}
              onPress={() => onSharePress(_id)}
              color={disliked ? 'dodgerblue' : 'white'}
            />
            <Buttons
              text=''
              isMute={muted}
              name={'volume'}
              onPress={() => onVolumePress()}
              color={disliked ? 'dodgerblue' : 'white'}
            />
            <Buttons
              text=''
              name={'play'}
              onPress={() => onCommentPress(_id)}
            />
          </>
        )}
      </View>
    ),
    [ShowOptions, optionsComponent, liked, disliked, muted]
  );

  const GetText = useMemo(
    () => (
      <View style={styles.textContainer}>
        {optionsComponent ? null : (
          <>
            {title && (
              <Text style={[styles.textHeaderStyle, textTitleStyle]}>
                {title}
              </Text>
            )}
            {description && (
              <Text
                numberOfLines={3}
                style={[styles.textStyle, textDescriptionStyle]}
              >
                {description}
              </Text>
            )}
          </>
        )}
      </View>
    ),
    [ShowOptions, optionsComponent, liked, disliked]
  );

  return (
    <Pressable
      onPress={onMiddlePress}
      style={[styles.container, { backgroundColor: backgroundColor }]}
    >
      <Pressable style={styles.FirstHalf} onPress={onFirstHalfPress} />
      <Pressable style={styles.SecondHalf} onPress={onSecondHalfPress} />
      <Video
        source={uri}
        repeat={true}
        muted={muted}
        paused={Paused}
        ref={VideoPlayer}
        resizeMode='contain'
        onError={videoError}
        style={VideoDimensions}
        onLoad={onLoadComplete}
        playInBackground={false}
        progressUpdateInterval={1000}
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
    bottom: 0,
    height: 55,
    zIndex: 100,
    width: ScreenWidth,
    position: 'absolute',
  },
  TimeOne: {
    left: 15,
    bottom: 5,
    color: 'grey',
    fontSize: 13,
    position: 'absolute',
  },
  TimeTwo: {
    right: 15,
    bottom: 5,
    fontSize: 13,
    color: 'grey',
    position: 'absolute',
  },
  OptionsContainer: {
    right: 10,
    bottom: 100,
    zIndex: 100,
    position: 'absolute',
  },
  textContainer: {
    left: 20,
    bottom: 130,
    zIndex: 100,
    position: 'absolute',
  },
  HeaderContainer: {
    top: 0,
    height: 50,
    zIndex: 100,
    width: ScreenWidth,
    position: 'absolute',
  },
  FirstHalf: {
    top: 0,
    left: 0,
    zIndex: 99,
    position: 'absolute',
    height: ScreenHeight,
    width: ScreenWidth * 0.25,
  },
  SecondHalf: {
    top: 0,
    right: 0,
    zIndex: 99,
    position: 'absolute',
    height: ScreenHeight,
    width: ScreenWidth * 0.25,
  },
  textHeaderStyle: {
    fontSize: 16,
    color: '#ffff',
    fontWeight: 'bold',
    textShadowRadius: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
  },
  textStyle: {
    fontSize: 10,
    marginTop: 5,
    color: '#ffff',
    textShadowRadius: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
  },
});
