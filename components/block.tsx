import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

const Block = ({
  children,
  style,
  flex = 1,
  row,
  grid = false,
  numColumns = 1,
  ...props
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  flex?: number;
  row?: boolean;
  grid?: boolean;
  numColumns?: number;
}) => {
  const blockStyle = StyleSheet.flatten([
    flex !== undefined && { flex },
    row && { flexDirection: 'row' as const },
    grid && {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      marginHorizontal: -4, // Compensation pour le gap
    },
    style,
  ]);

  const childStyle = grid
    ? {
        width: `${100 / numColumns}%` as unknown as number,
        paddingHorizontal: 4, // Crée un espacement uniforme
      }
    : undefined;

  return (
    <View style={blockStyle} {...props}>
      {React.Children.map(children, (child) =>
        grid ? <View style={childStyle}>{child}</View> : child
      )}
    </View>
  );
};

export default Block;
