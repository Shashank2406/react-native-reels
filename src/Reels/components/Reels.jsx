import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList } from 'react-native';

import ReelCard from './ReelCard';
const ScreenHeight = Dimensions.get('window').height;

function Reels({
  videos,
  navigation,
  headerIcon,
  headerTitle,
  onLikePress,
  onPlayPress,
  onSharePress,
  onCommentPress,
  headerIconName,
  headerIconSize,
  onDislikePress,
  thumbTintColor,
  totalTimeColor,
  textTitleStyle,
  headerIconColor,
  onFinishPlaying,
  headerComponent,
  timeElapsedColor,
  optionsComponent,
  onHeaderIconPress,
  pauseOnOptionsShow,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  textDescriptionStyle,
  minimumTrackTintColor,
  maximumTrackTintColor,
  ListFooterComponentStyle,
  ListHeaderComponentStyle,
  backgroundColor = 'black',
  enablePlayPauseOnNavigation,
}) {
  const FlatlistRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [isPause, setPause] = useState(false);
  const [ViewableItem, SetViewableItem] = useState('');
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 70 });

  useEffect(() => {
    if (enablePlayPauseOnNavigation) {
      navigation.addListener('focus', () => {
        setPause(false);
      });
      navigation.addListener('blur', () => {
        setPause(true);
      });
    }
  });

  const applyProps = {
    headerIcon: headerIcon,
    headerTitle: headerTitle,
    onLikePress: onLikePress,
    onSharePress: onSharePress,
    onDislikePress: onDislikePress,
    onCommentPress: onCommentPress,
    totalTimeColor: totalTimeColor,
    thumbTintColor: thumbTintColor,
    headerIconName: headerIconName,
    headerIconSize: headerIconSize,
    onFinishPlaying: onFinishPlaying,
    backgroundColor: backgroundColor,
    headerIconColor: headerIconColor,
    headerComponent: headerComponent,
    timeElapsedColor: timeElapsedColor,
    optionsComponent: optionsComponent,
    onHeaderIconPress: onHeaderIconPress,
    pauseOnOptionsShow: pauseOnOptionsShow,
    minimumTrackTintColor: minimumTrackTintColor,
    maximumTrackTintColor: maximumTrackTintColor,
  };

  // Viewable configuration
  const onViewRef = useRef((viewableItems) => {
    if (viewableItems?.viewableItems?.length > 0)
      SetViewableItem(viewableItems.viewableItems[0].item._id || 0);
  });

  return (
    <FlatList
      data={videos}
      pagingEnabled
      ref={FlatlistRef}
      decelerationRate={0.9}
      getItemLayout={(_data, index) => ({
        length: ScreenHeight,
        offset: ScreenHeight * index,
        index,
      })}
      ListEmptyComponent={ListEmptyComponent}
      viewabilityConfig={viewConfigRef.current}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      onViewableItemsChanged={onViewRef.current}
      ListFooterComponentStyle={ListFooterComponentStyle}
      ListHeaderComponentStyle={ListHeaderComponentStyle}
      keyExtractor={(item, index) => `${item?._id}_${index}`}
      renderItem={({ item, index }) => (
        <ReelCard
          {...item}
          data={item}
          muted={muted}
          index={index}
          isPauseOutside={isPause}
          onLikePress={onLikePress}
          onPlayPress={onPlayPress}
          onSharePress={onSharePress}
          ViewableItem={ViewableItem}
          textTitleStyle={textTitleStyle}
          onVolumePress={() => setMuted(!muted)}
          textDescriptionStyle={textDescriptionStyle}
          onFinishPlaying={(index) => {
            if (index !== videos.length - 1) {
              FlatlistRef?.current?.scrollToIndex({
                index: index + 1,
              });
            }
          }}
          {...applyProps}
        />
      )}
    />
  );
}

export default Reels;
