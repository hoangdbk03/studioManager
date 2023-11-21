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
import ManagerClient from "../components/ManagerClient";
import Register from "../components/Register";
import ManagerBill from "../components/ManagerBill";
import ManagerStaff from "../components/ManagerStaff";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import FloatingButton from "../items/FloatingButton";

//splashScreen, login (Stack)
const Stack = createStackNavigator();
const Users = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
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
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          display: hideTabBar(route),
          ...styles.shadow,
        },
        tabBarLabelStyle: {
          bottom: 10,
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={PageHome}
        options={({ route }) => ({
          title: "Trang chủ",
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name == "Home") {
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
        name="PageProfile"
        component={PageProfile}
        options={({ route }) => ({
          // tabBarStyle:{display: hideTabBar(route)},
          title: "Cá nhân",
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name == "PageProfile") {
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
    <>
    <FloatingButton/>
    <Stack.Navigator initialRouteName="PageHome">
      <Stack.Screen
        name="PageHome"
        component={Home}
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="ManagerStaff"
        component={ManagerStaff}
        options={{ headerTitle: "Quản lý nhân viên" }}
      />
      <Stack.Screen
        name="ManagerClient"
        component={ManagerClient}
        options={{ headerTitle: "Quản lý khách hàng" }}
      />
      <Stack.Screen
        name="ManagerBill"
        component={ManagerBill}
        options={{ headerTitle: "Quản lý hóa đơn" }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerTitle: "Đăng ký người dùng" }}
      />
    </Stack.Navigator>
    </>
  );
};

//profile
const PageProfile = () => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const hideTabBar = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

  const screensToHideTabBar = [
    "ManagerClient",
    "ManagerBill",
    "Register",
    "ManagerStaff",
  ];

  if (screensToHideTabBar.includes(routeName)) {
    return "none";
  }
  return "flex";
};

const AppNavigator = () => {
  const { isLogin } = useContext(AppConText);
  return <>{isLogin == false ? <Users /> : <Main />}</>;
};

export default AppNavigator;

const styles = StyleSheet.create({
  shadow: {
    position: "absolute",
    borderWidth: 4,
    borderColor: '#0E55A7',
    bottom: 15,
    left: 10,
    right: 10,
    elevation: 0,
    borderRadius: 15,
    height: 70,
    shadowColor: "#0E55A7",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 5,
  },
  tabIcon: {
    justifyContent: "center",
    alignItems: "center",
    top: 10,
  },
});
