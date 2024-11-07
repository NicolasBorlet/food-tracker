import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Entypo } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import DefaultTheme from './themes/DefaultTheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Gilroy: require('../assets/fonts/Gilroy-Regular.ttf'),
    GilroyBold: require('../assets/fonts/Gilroy-Bold.ttf'),
    GilroyMedium: require('../assets/fonts/Gilroy-Medium.ttf'),
    GilroySemiBold: require('../assets/fonts/Gilroy-SemiBold.ttf'),
    GilroyExtraBold: require('../assets/fonts/Gilroy-ExtraBold.ttf'),
    GilroyHeavy: require('../assets/fonts/Gilroy-Heavy.ttf'),
    GilroyLight: require('../assets/fonts/Gilroy-Light.ttf'),
    GilroyUltraLight: require('../assets/fonts/Gilroy-UltraLight.ttf'),
    GilroyThin: require('../assets/fonts/Gilroy-Thin.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DefaultTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="fridge/[id]"
          options={{
            headerLeft: () => <Pressable onPress={() => router.back()}><Entypo name="chevron-left" size={24} color="rgb(255, 90, 79)" /></Pressable>
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
