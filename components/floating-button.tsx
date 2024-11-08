import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import Block from "./block";

export default function FloatingButton() {
  const [isRotated, setIsRotated] = useState(false);

  const paddingStyle = useAnimatedStyle(() => ({
    padding: withTiming(isRotated ? 8 : 16, {
      duration: 300
    }),
  }));

  const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        rotate: withTiming(isRotated ? '45deg' : '0deg', {
          duration: 300
        })
      }],
    };
  });

  const slideAnimation = useAnimatedStyle(() => ({
    opacity: withTiming(isRotated ? 1 : 0, { duration: 200 }),
    transform: [{
      translateY: withTiming(isRotated ? 0 : 20, { duration: 200 })
    }]
  }));

  return (
    <Block style={{ position: 'absolute', bottom: 20, right: 20, alignItems: 'flex-end' }}>
      {isRotated && (
        <View style={{ marginBottom: 16, alignItems: 'flex-end', gap: 8 }}>
          <Animated.View style={[slideAnimation]}>
            <TouchableOpacity style={{
              backgroundColor: 'white',
              padding: 12,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
              <Ionicons name="document-outline" size={24} color="rgb(255, 90, 79)" />
              <Text>Premier élément</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[slideAnimation]}>
            <TouchableOpacity style={{
              backgroundColor: 'white',
              padding: 12,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
              <Ionicons name="image-outline" size={24} color="rgb(255, 90, 79)" />
              <Text>Second élément</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      <TouchableOpacity onPress={() => setIsRotated(!isRotated)}>
        <Animated.View style={[
          paddingStyle,
          {
            backgroundColor: 'rgb(255, 90, 79)',
            borderRadius: 50,
            width: 56,
            height: 56,
            alignItems: 'center',
            justifyContent: 'center',
          }
        ]}>
          <AnimatedIcon
            style={rStyle}
            name="add-outline"
            size={24}
            color="white"
          />
        </Animated.View>
      </TouchableOpacity>
    </Block>
  );
}
