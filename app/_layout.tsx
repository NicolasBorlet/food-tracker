import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import DarkTheme from './themes/DarkTheme';
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
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
