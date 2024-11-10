import { Image, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import Block from '@/components/block';
import { H1 } from '@/components/styled-title';

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
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <Block>
        <H1>Bienvenue sur FridgeAI</H1>
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
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
