import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SplashScreen from "../components/SplashScreen";
import Login from "../components/Login";
import Home from "../components/Home";
import Job from "../components/Job";
import Cart from "../components/Cart";
import Profile from "../components/Profile";
import { AppConText } from "./AppContext";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Octicons from "react-native-vector-icons/Octicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import ManagerClient from "../components/ManagerClient";
import Register from "../components/Register";
import ManagerStaff from "../components/ManagerStaff";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import FloatingButton from "../items/FloatingButton";
import DetailStaff from "../components/DetailStaff";
import ManagerService from "../components/ManagerService";
import { useEffect } from "react";
import AxiosIntance from "./AxiosIntance";
import Client from "../components/Client";
import { useNavigation } from "@react-navigation/native";
import DetailUser from "../components/DetailUser";

// TODO: splashScreen, login (Stack)
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

// TODO: trang chủ, lịch, lịch sử, profile (Tab)
const Tab = createBottomTabNavigator();
const Main = () => {
  const [cartCount, setCartCount] = useState(0);
  const { inforUser } = useContext(AppConText);

  const fetchCartCount = async () => {
    try {
      const response = await AxiosIntance().get(`/cart/list/${inforUser._id}`);
      const cartData = response.services;
      const itemCount = Array.isArray(cartData)
        ? cartData.length
        : 0;
      setCartCount(itemCount);
    } catch (error) {}
  };

  // TODO: kiểm tra data
  useEffect(() => {
    fetchCartCount();
    // const interval = setInterval(()=>{
    //   fetchCartCount();
    // }, 1000);
    // return ()=> clearInterval(interval);
  }, []);

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
        tabBarHideOnKeyboard: true,
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
            return <Octicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#0E55A7",
        })}
      ></Tab.Screen>

      <Tab.Screen
        name="Job"
        component={Job}
        options={({ route }) => ({
          title: "Công việc",
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name == "Job") {
              iconName = focused ? "profile" : "profile";
            }
            return <AntDesign name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#0E55A7",
        })}
      ></Tab.Screen>

      {inforUser.role !== "Nhân viên" ? (
        <Tab.Screen
          name="Cart"
          component={Cart}
          options={({ route }) => ({
            title: "Đơn hàng",
            tabBarIcon: ({ focused, color }) => {
              let iconName;
              if (route.name == "Cart") {
                iconName = focused ? "shopping-cart" : "shopping-cart";
              }
              return <Feather name={iconName} size={23} color={color} />;
            },
            tabBarActiveTintColor: "#0E55A7",
            tabBarBadge: cartCount,
            tabBarBadgeStyle: { fontSize: 8 },
          })}
        ></Tab.Screen>
      ) : (
        <Tab.Screen
          name="Client"
          component={Client}
          options={({ route }) => ({
            title: "Khách hàng",
            tabBarIcon: ({ focused, color }) => {
              let iconImage = focused
                ? require("../icons/client.png")
                : require("../icons/client.png");
              return (
                <Image
                  source={iconImage}
                  style={{ width: 28, height: 28, tintColor: color }}
                />
              );
            },
            tabBarActiveTintColor: "#0E55A7",
          })}
        ></Tab.Screen>
      )}
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

// TODO: trang home
const PageHome = () => {
  return (
      <Stack.Navigator initialRouteName="PageHome">
        <Stack.Screen
          name="PageHome"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ManagerStaff"
          component={ManagerStaff}
          options={{
            headerTitle: "Quản lý nhân viên",
            headerBackTitle: "Quay lại",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="DetailStaff"
          component={DetailStaff}
          options={{
            headerTitle: "Thông tin nhân viên",
            headerStyle: { backgroundColor: "#062446", elevation: 0 },
            headerTitleAlign: "center",
            headerTintColor: "white",
            headerBackTitle: "Quay lại",
            presentation: "transparentModal",
          }}
        />
        <Stack.Screen
          name="ManagerService"
          component={ManagerService}
          options={{
            headerTitle: "Dịch vụ",
            headerBackTitle: "Quay lại",
            headerTitleAlign: "center",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="ManagerClient"
          component={ManagerClient}
          options={{
            headerTitle: "Quản lý khách hàng",
            headerBackTitle: "Quay lại",
            headerTitleAlign: "center",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{
            headerTitle: "Đăng ký người dùng",
            headerBackTitle: "Quay lại",
            headerTitleAlign: "center",
            presentation: "modal",
          }}
        />
      </Stack.Navigator>
  );
};

// TODO: Trang cá nhân
const PageProfile = () => {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailUser"
        component={DetailUser}
        options={{
          headerTitle: "Thông tin của bạn",
          headerBackTitle: "Quay lại",
          headerTitleAlign: "center",
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
};

// * xử lý ẩn bottom bar khi sử dụng stack
const hideTabBar = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";

  const screensToHideTabBar = [
    "ManagerClient",
    "Register",
    "ManagerStaff",
    "DetailStaff",
    "ManagerService",
    "DetailUser",
  ];

  if (screensToHideTabBar.includes(routeName)) {
    return "none";
  }
  return "flex";
};

// TODO: Main
const AppNavigator = () => {
  const { isLogin } = useContext(AppConText);
  return <>{isLogin == false ? <Users /> : <Main />}</>;
};

export default AppNavigator;

const styles = StyleSheet.create({
  shadow: {
    position: "absolute",
    borderWidth: 4,
    borderColor: "#0E55A7",
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
