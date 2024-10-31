import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

const Block = ({
  children,
  style,
  flex = 1,
  row,
  ...props
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  flex?: number;
  row?: boolean;
}) => {
  const blockStyle = StyleSheet.flatten([
    flex !== undefined && { flex },
    row && { flexDirection: 'row' as const },
    style,
  ])

  return (
    <View style={blockStyle} {...props}>
      {children}
    </View>
  )
}

export default Block