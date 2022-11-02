import React, { useRef, useState } from 'react';
import { Dimensions, FlatList } from 'react-native';

import ReelCard from './ReelCard';
const ScreenHeight = Dimensions.get('window').height;

function Reels({
  videos,
  headerIcon,
  headerTitle,
  onLikePress,
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
  textDescriptionStyle,
  minimumTrackTintColor,
  maximumTrackTintColor,
  backgroundColor = 'black',
}) {
  const FlatlistRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const [ViewableItem, SetViewableItem] = useState('');
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 70 });

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
      viewabilityConfig={viewConfigRef.current}
      onViewableItemsChanged={onViewRef.current}
      keyExtractor={(item, index) => `${item?._id}_${index}`}
      renderItem={({ item, index }) => (
        <ReelCard
          {...item}
          muted={muted}
          index={index}
          onLikePress={onLikePress}
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
