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
      ref={FlatlistRef}
      data={videos}
      keyExtractor={(item) => item._id.toString()}
      renderItem={({ item, index }) => (
        <ReelCard
          {...item}
          muted={muted}
          index={index}
          pagingEnabled
          {...applyProps}
          decelerationRate={0.9}
          ViewableItem={ViewableItem}
          textTitleStyle={textTitleStyle}
          getItemLayout={(_data, index) => ({
            length: ScreenHeight,
            offset: ScreenHeight * index,
            index,
          })}
          onVolumePress={() => setMuted(!muted)}
          onFinishPlaying={(index) => {
            if (index !== videos.length - 1) {
              FlatlistRef.current.scrollToIndex({
                index: index + 1,
              });
            }
          }}
          viewabilityConfig={viewConfigRef.current}
          onViewableItemsChanged={onViewRef.current}
          textDescriptionStyle={textDescriptionStyle}
        />
      )}
    />
  );
}

export default Reels;
