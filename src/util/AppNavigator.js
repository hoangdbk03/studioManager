import { Image, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SplashScreen from "../components/SplashScreen";
import Login from "../components/Login";
import Home from "../components/Home";
import Calendar from "../components/Calendar";
import History from "../components/History";
import Profile from "../components/Profile";
import { AppConText } from "./AppContext";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IonIcons from "react-native-vector-icons/Ionicons";
import DetailClient from "../components/DetailClient";
import Client from "../components/Client";
import { NavigationContainer } from "@react-navigation/native";

//splashScreen, login (Stack)
const Stack = createStackNavigator();
const Users = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
};

//trang chủ, lịch, lịch sử, profile (Tab)
const Tab = createBottomTabNavigator();
const Main = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 15,
          left: 10,
          right: 10,
          elevation: 0,
          borderRadius: 15,
          height: 70,
          backgroundColor: "white",
          ...styles.shadow,
        },
        tabBarLabelStyle: {
          bottom: 10,
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="PageHome"
        component={PageHome}
        options={({ route }) => ({
          title: "Trang chủ",
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name == "PageHome") {
              iconName = focused ? "home" : "home";
            }
            return <FontAwesome5 name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#0E55A7",
        })}
      ></Tab.Screen>
      <Tab.Screen
        name="Calendar"
        component={Calendar}
        options={({ route }) => ({
          title: "Lịch trình",
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name == "Calendar") {
              iconName = focused ? "calendar-outline" : "calendar-outline";
            }
            return <IonIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#0E55A7",
        })}
      ></Tab.Screen>
      <Tab.Screen
        name="History"
        component={History}
        options={({ route }) => ({
          title: "Lịch sử",
          tabBarIcon: ({ focused, color }) => {
            let iconName;
            if (route.name == "History") {
              iconName = focused ? "history" : "history";
            }
            return <FontAwesome5 name={iconName} size={23} color={color} />;
          },
          tabBarActiveTintColor: "#0E55A7",
        })}
      ></Tab.Screen>
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={({ route }) => ({
          title: "Cá nhân",
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name == "Profile") {
              iconName = focused ? "user-circle" : "user-circle";
            }
            return <FontAwesome5 name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#0E55A7",
        })}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

//home
const PageHome = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home}/>
    </Stack.Navigator>
  );
};


const AppNavigator = () => {
  const { isLogin } = useContext(AppConText);
  return (
    <>
      {isLogin == false ? <Users /> : <Main />}
      
    </>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  tabIcon: {
    justifyContent: "center",
    alignItems: "center",
    top: 10,
  },
});
