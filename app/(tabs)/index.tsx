import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import Block from '@/components/block';
import { Card } from '@/components/styled-card';
import { Body, H1, H2 } from '@/components/styled-title';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useFridge } from '../contexts/FridgeContext';

const macros = [
  {
    label: 'Protein',
    value: 20,
    color: '#FF5A4F',
  },
  {
    label: 'Carbohydrates',
    value: 10,
    color: '#29B750',
  },
  {
    label: 'Fat',
    value: 30,
    color: '#F2C94C',
  },
]

export default function HomeScreen() {
  const { fridges, setSelectedFridgeId } = useFridge();

  const handleFridgePress = (fridgeId: string) => {
    setSelectedFridgeId(fridgeId).then(() => {
      router.navigate(`/fridge`);
    });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: 'rgb(255, 90, 79)', dark: 'rgb(255, 90, 79)' }}
      headerImage={
        <Image
          source={require('@/assets/images/empty-fridge-white.png')}
          style={styles.fridgeImage}
        />
      }>
      <Block style={{ gap: 32 }}>
        <Block style={{ gap: 8 }}>
          <H1>Bienvenue sur FridgeAI</H1>
          <Body>
            FridgeAI est une application qui vous permet de gérer votre frigo en toute simplicité.
          </Body>
        </Block>

          <Block style={{ gap: 8 }}>
            <H2>Frigos disponibles</H2>
            <Block grid numColumns={2}>
              {fridges.map((fridge) => (
                <TouchableOpacity
                  key={fridge.id}
                  onPress={() => handleFridgePress(fridge.id)}
                  style={{ marginBottom: 8 }}
                >
                  <Card>
                    <Body>{fridge.name}</Body>
                    <View style={{ position: 'absolute', right: 16, top: 16 }}>
                      <FontAwesome name="chevron-right" size={12} color="black" />
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </Block>
          </Block>
      </Block>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  fridgeImage: {
    height: 278,
    width: 390,
    top: '20%',
    left: '-20%',
    position: 'absolute',
    zIndex: 1,
    resizeMode: 'contain',
  },
});
