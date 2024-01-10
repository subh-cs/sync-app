import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/RootNavigator';
import { PaperProvider } from 'react-native-paper';
import env from './utils/env';
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from './utils/tokenCache';

export default function App() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={env.CLERK_PUBLISHABLE_KEY}>
      <NavigationContainer>
        <PaperProvider>
          <RootNavigator />
        </PaperProvider>
      </NavigationContainer>
    </ClerkProvider>
  );
}
