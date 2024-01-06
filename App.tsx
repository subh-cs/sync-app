import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/RootNavigator';
import { PaperProvider } from 'react-native-paper';
import Constants from "expo-constants"
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export default function App() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={Constants?.expoConfig?.extra?.clerkPublishableKey}>
      <NavigationContainer>
        <PaperProvider>
          <RootNavigator />
        </PaperProvider>
      </NavigationContainer>
    </ClerkProvider>
  );
}
