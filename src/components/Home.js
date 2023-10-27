import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import { AppConText } from "../util/AppContext";
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Client from "../components/Client";
import Bill from "../components/Bill";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { createStackNavigator } from "@react-navigation/stack";

const TabTop = createMaterialTopTabNavigator();

const CustomTab = ({ label, imageSource, isFocused, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Image source={imageSource} style={{ width: 30, height: 30, tintColor: isFocused ? '#0E55A7' : 'black' }} />
    <Text style={{ color: isFocused ? '#0E55A7' : 'black' }}>{label}</Text>
  </TouchableOpacity>
);

const Home = ({navigation}) => {
  const { inforUser } = useContext(AppConText);

  return (
    <View style={styles.container}>
      {/* phần header avatar, ngày tháng và background */}
      <View style={styles.header}>
        <View style={styles.daymon_avatar}>
          <View style={{ width: 300 }}>
            <Text style={styles.day}>Thứ Hai</Text>
            <Text style={styles.daymon}>Ngày 13/10/2023</Text>
          </View>
          <View style={styles.conavatar}>
            <Image style={styles.avatar} source={{ uri: inforUser.avatar }} />
          </View>
        </View>
        <Image
          style={styles.logoHome}
          source={require("../img/logoHome.jpg")}
        />
      </View>

      {/* phần thân */}
      <View style={styles.body}>
        <TabTop.Navigator
          style={{ marginTop: 50 }}
          initialRouteName="Client"
          screenOptions={{
            tabBarInactiveTintColor: "black",
            tabBarLabelStyle: {textTransform: 'none'  },
            tabBarIconStyle: { height: 35 },
            ...styles.tabTop,
          }}
        >
          <TabTop.Screen
            name="Client"
            component={Client}
            options={{
              tabBarLabel: 'Khách hàng',
              tabBarIcon: ({ focused }) => (
                <CustomTab
                  
                  imageSource={require('../icons/list.png')}
                  isFocused={focused}
                />
              ),
            }}
          />
          <TabTop.Screen
            name="Bill"
            component={Bill}
            options={{
              tabBarLabel: 'Hóa đơn',
              tabBarIcon: ({ focused }) => (
                <CustomTab
                  
                  imageSource={require('../icons/bill.png')}
                  isFocused={focused}
                />
              ),
            }}
          />
        </TabTop.Navigator>
      </View>

      {/* khung button nhân viên và gói chụp */}
      <View style={styles.mid_header_body}>
        <TouchableOpacity style={styles.itemMid}>
          <Image
            style={styles.iconMid}
            source={require("../icons/card_staff.png")}
          />
          <Text style={styles.textMid}>Nhân viên</Text>
        </TouchableOpacity>
        <View
          style={{
            width: 2,
            height: 20,
            backgroundColor: "black",
            borderRadius: 20,
          }}
        ></View>
        <TouchableOpacity style={styles.itemMid}>
          <Image
            style={styles.iconMid}
            source={require("../icons/camera.png")}
          />
          <Text style={styles.textMid}>Dịch vụ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  logoHome: {
    width: 390,
    height: 150,
  },
  header: {
    height: 300,
    marginTop: 40,
    backgroundColor: "#fafbfd",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  conavatar: {
    backgroundColor: "#5e5e5e",
    width: 45,
    height: 45,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  daymon_avatar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },
  day: {
    color: "#7F7F7F",
    fontSize: 18,
  },
  daymon: {
    fontSize: 20,
  },
  body: {
    flex: 1,
    width: "95%",
    height: "55%",
    backgroundColor: "white",
    position: "absolute",
    marginTop: 285,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  mid_header_body: {
    width: "85%",
    height: 50,
    backgroundColor: "#F8F8F8",
    position: "absolute",
    flexDirection: "row",
    top: 270,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  iconMid: {
    width: 28,
    height: 28,
  },
  itemMid: {
    flexDirection: "row",
    marginStart: 30,
  },
  textMid: {
    width: 100,
    height: 28,
    marginStart: 10,
    top: 4,
  },
});
