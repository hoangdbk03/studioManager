import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ItemListCart from "./ItemListCart";
import AxiosIntance from "../util/AxiosIntance";
import { AppConText } from "../util/AppContext";
import Toast from "react-native-toast-message";
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";

const Cart = () => {
  const [data, setData] = useState([]);
  const { inforUser } = useContext(AppConText);
  const navigation = useNavigation();

  // gọi api danh sách giỏ hàng
  const fetchData = async () => {
    try {
      const response = await AxiosIntance().get(`/cart/list/${inforUser._id}`);
      const apiDataServices = response.services;
      setData(apiDataServices);
    } catch (error) {}
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 3000);
    fetchData();
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.frameFab}>
        <View style={styles.frameText}>
          <Text style={styles.text}>Chọn đơn hàng cần xác nhận</Text>
        </View>
        <View style={{width: 1, backgroundColor: 'white'}}/>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("ManagerService")}
        >
          <Text style={styles.textfab}>Dịch vụ</Text>
          <Entypo name="camera" size={25} color={"white"} />
        </TouchableOpacity>
      </View>
      {data.length > 0 ? (
        <FlatList
          style={{ marginBottom: "21%" }}
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ItemListCart item={item} />}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              width: 150,
              height: 150,
              backgroundColor: "#e7eef6",
              borderRadius: 300,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{ width: 60, height: 60, tintColor: "#b4cae4" }}
              source={require("../img/taskList.png")}
            />
          </View>
          <Text style={{ color: "#545454", marginTop: 10 }}>
            Chưa có đơn hàng nào
          </Text>
        </View>
      )}
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  fab: {
    flexDirection: "row",
    padding: 10,
    width: 120,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  textfab: {
    color: "white",
    fontWeight: "500",
    marginEnd: 10,
    fontSize: 15,
  },
  frameFab: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#0E55A7",
    borderRadius: 10
  },
  text:{
    color: "white",
    fontWeight: "500",
    marginEnd: 10,
    fontSize: 15,
  },
  frameText:{
    flex: 1,
    padding: 10,
    width: 120,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  }
});
