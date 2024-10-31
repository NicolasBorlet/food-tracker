import { Image, Pressable, StyleSheet } from 'react-native';

import Block from '@/components/block';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { StyledButton } from '@/components/styled-button';
import { Card } from '@/components/styled-card';
import { ButtonText, Caption, H2, Small } from '@/components/styled-title';
import { Entypo, EvilIcons } from '@expo/vector-icons';

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
      <StyledButton>
        <ButtonText>Click me</ButtonText>
      </StyledButton>
      <Card title="Today">
        <Pressable style={{
            position: 'absolute',
            right: 10,
            top: '50%',
          }}
          onPress={() => {
            console.log('pressed');
          }}
        >
          <EvilIcons name="trash" size={32} color="#FF5A4F"/>
        </Pressable>
        <Small>
          {new Date().toLocaleDateString()}
        </Small>
        <Block row>
          <Block row style={{
            alignItems: 'flex-end',
            gap: 4,
          }}>
            <H2>
              61.90
            </H2>
            <Small>
              kg
            </Small>
          </Block>
          <Block row style={{
              alignItems: 'flex-end',
              gap: 4,
            }}>
            <H2>
              2650/2550
            </H2>
            <Small>
              cal
            </Small>
          </Block>
        </Block>
        <Block row>
          <Block row style={{
            alignItems: 'flex-end',
            gap: 4,
          }}>
            <Caption style={{
              textTransform: 'uppercase',
            }}>
              Body weight
            </Caption>
            <Entypo name="chevron-small-up" size={12} color="#FF5A4F" />
          </Block>
          <Block row style={{
            alignItems: 'flex-end',
            gap: 4,
          }}>
            <Caption style={{
              textTransform: 'uppercase',
            }}>
              Calories
            </Caption>
            <Entypo name="chevron-small-up" size={12} color="#29B750" />
          </Block>
        </Block>
      </Card>
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
