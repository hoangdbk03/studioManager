import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SplashScreen from './src/components/SplashScreen';
import Login from './src/components/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppConTextProvider } from './src/util/AppContext';
import AppNavigator from './src/util/AppNavigator';
import Register from './src/components/Register';
import DetailClient from './src/components/DetailClient';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppConTextProvider>
      <NavigationContainer>
        <AppNavigator></AppNavigator>
      </NavigationContainer>
    </AppConTextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
