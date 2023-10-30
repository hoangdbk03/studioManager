import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Component, useContext, useEffect, useState } from "react";
import { AppConText } from "../util/AppContext";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Client from "../components/Client";
import Bill from "../components/Bill";
import { vi } from "date-fns/locale";
import "intl";
import "intl/locale-data/jsonp/vi";
import { format } from "date-fns";
import AxiosIntance from "../util/AxiosIntance";

const TabTop = createMaterialTopTabNavigator();

const CustomTab = ({ label, imageSource, isFocused, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Image
      source={imageSource}
      style={{
        width: 30,
        height: 30,
        tintColor: isFocused ? "#0E55A7" : "black",
      }}
    />
    <Text style={{ color: isFocused ? "#0E55A7" : "black" }}>{label}</Text>
  </TouchableOpacity>
);

const Home = () => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDataFromServer = async () => {
    try {
      const response = await AxiosIntance().get("/user/list/update/");
      const newData = await response;

      setData(newData);
      setRefreshing(false);
    } catch (error) {}
  };

  const handleRefreshData = () => {
    setRefreshing(true);
    fetchDataFromServer();
  };

  useEffect(() => {
    fetchDataFromServer();
    // Thiết lập ngôn ngữ mặc định cho ứng dụng thành tiếng Việt
    if (Platform.OS === "android") {
      require("intl/locale-data/jsonp/vi");
    }
  }, []);

  // Lấy ngày hiện tại
  const today = new Date();

  const dayName = format(today, "EEEE", { locale: vi });
  const dayOfMonth = format(today, "d MMMM yyyy", { locale: vi });

  const { inforUser } = useContext(AppConText);

  return (
    <View style={styles.container}>
      {/* phần header avatar, ngày tháng và background */}
      <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefreshData} />
      }>
        <View style={styles.header}>
          <View style={styles.daymon_avatar}>
            <View style={{ width: 300 }}>
              <Text style={styles.day}>{dayName}</Text>
              <Text style={styles.daymon}>Ngày {dayOfMonth}</Text>
            </View>
            <View style={styles.conavatar}>
              {inforUser.avatar ? (
                <Image
                  style={styles.avatar}
                  source={{ uri: inforUser.avatar }}
                />
              ) : (
                <Image
                  style={styles.avatar}
                  source={require("../icons/user.png")}
                />
              )}
            </View>
          </View>
          <Image
            style={styles.logoHome}
            source={require("../img/logoHome.jpg")}
          />
        </View>
      </ScrollView>

      {/* phần thân */}
      <View style={styles.body}>
        <TabTop.Navigator
          style={{ marginTop: 50 }}
          initialRouteName="Client"
          screenOptions={{
            tabBarInactiveTintColor: "black",
            tabBarLabelStyle: { textTransform: "none" },
            tabBarIconStyle: { height: 35 },
            ...styles.tabTop,
          }}
        >
          <TabTop.Screen
            name="Client"
            component={Client}
            options={{
              tabBarLabel: "Khách hàng",
              tabBarIcon: ({ focused }) => (
                <CustomTab
                  imageSource={require("../icons/list.png")}
                  isFocused={focused}
                />
              ),
            }}
          />
          <TabTop.Screen
            name="Bill"
            component={Bill}
            options={{
              tabBarLabel: "Hóa đơn",
              tabBarIcon: ({ focused }) => (
                <CustomTab
                  imageSource={require("../icons/bill.png")}
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
    backgroundColor: "white",
  },
  conavatar: {
    backgroundColor: "#5e5e5e",
    width: 42,
    height: 42,
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
