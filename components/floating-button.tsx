import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useFridge } from "../app/contexts/FridgeContext";
import { Product } from "../app/types/types";
import { saveProduct } from "../app/utils/productUtils";
import Block from "./block";
import SearchProductModal from "./search-product-modal";
import { Body } from "./styled-title";

export default function FloatingButton() {
  const [isRotated, setIsRotated] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const { selectedFridgeId } = useFridge();

  const handleAddProduct = () => {
    setIsSearchModalVisible(true);
    setIsRotated(false);
  };

  const handleSelectProduct = async (product: Product) => {
    if (selectedFridgeId) {
      try {
        await saveProduct(product, selectedFridgeId);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du produit:', error);
      }
    }
  };

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
      <SearchProductModal
        isVisible={isSearchModalVisible}
        onClose={() => setIsSearchModalVisible(false)}
        onSelectProduct={handleSelectProduct}
      />

      {isRotated && (
        <View style={{ marginBottom: 16, alignItems: 'flex-end', gap: 8 }}>
          <Animated.View style={[slideAnimation]}>
            <TouchableOpacity
              style={{
                backgroundColor: 'rgb(255, 90, 79)',
                padding: 12,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
              onPress={handleAddProduct}
            >
              <Ionicons name="add-circle-outline" size={24} color="white" />
              <Body style={{ color: 'white' }}>Ajouter un produit</Body>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[slideAnimation]}>
            <TouchableOpacity
              style={{
                backgroundColor: 'rgb(255, 90, 79)',
                padding: 12,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
              onPress={handleAddProduct}
            >
              <Ionicons name="pizza-outline" size={24} color="white" />
              <Body style={{ color: 'white' }}>Générer une recette</Body>
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
