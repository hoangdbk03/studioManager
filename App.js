import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AppConTextProvider } from "./src/util/AppContext";
import AppNavigator from "./src/util/AppNavigator";
import Toast from "react-native-toast-message";
import { PaperProvider } from 'react-native-paper';

export default function App() {
  return (
    <PaperProvider>
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="white" barStyle="dark-content"/>
      <AppConTextProvider>
        <NavigationContainer>
          <AppNavigator></AppNavigator>
        </NavigationContainer>
      </AppConTextProvider>
      <Toast />
    </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
