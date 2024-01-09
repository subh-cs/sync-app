import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/RootNavigator';
import { PaperProvider } from 'react-native-paper';
import Constants from "expo-constants"
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from './utils/tokenCache';

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
