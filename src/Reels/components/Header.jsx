import React from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';

function Header({
  onPress,
  size = 30,
  customIcon,
  text = 'Reels',
  color = 'white',
  customComponent,
  name = 'arrowleft',
}) {
  return (
    <Pressable onPress={onPress}>
      {customComponent ? (
        customComponent
      ) : (
        <View style={styles.container}>
          {customIcon ? null : (
            <AntDesign name={name} color={color} size={size} />
          )}

          <Text style={styles.Text}>{text}</Text>
        </View>
      )}
    </Pressable>
  );
}

export default Header;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginLeft: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  Text: {
    fontSize: 20,
    color: 'white',
    marginLeft: 20,
    fontWeight: 'bold',
  },
});
