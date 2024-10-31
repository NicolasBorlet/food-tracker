import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Block from "./block";
import { Body } from "./styled-title";

export default function Progress({
  title,
  value,
  maxValue
}: {
  title: string;
  value: number;
  maxValue: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(value / maxValue, {
      duration: 1000,
    });
  }, [value, maxValue]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <Block style={{
      gap: 8,
    }}>
      <Block row style={{
        justifyContent: 'space-between',
      }}>
        <Body>
          {title}
        </Body>
        <Body>
          {value}/{maxValue}g
        </Body>
      </Block>
      <Block>
        <View
          style={{
            backgroundColor: '#DEDEDE',
            height: 8,
            borderRadius: 10,
          }}
        ></View>
        <Animated.View
          style={[
            {
              backgroundColor: '#C273FF',
              height: 8,
              borderRadius: 10,
              position: 'absolute',
              left: 0,
              top: 0,
            },
            progressStyle,
          ]}
        ></Animated.View>
      </Block>
    </Block>
  );
}