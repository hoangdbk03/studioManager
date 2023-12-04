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
      const apiData = response.items;
      setData(apiData);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Không lấy được dữ liệu",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ItemListCart item={item} />}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{width: 150, height: 150, backgroundColor: '#e7eef6', borderRadius: 300, justifyContent: 'center', alignItems: 'center'}}>
            <Image style={{width: 60, height: 60, tintColor: '#b4cae4'}} source={require("../img/taskList.png")} />
          </View>
          <Text style={{color: '#545454', marginTop: 10}}>Chưa có đơn hàng nào</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("ManagerService")}
      >
        <Text style={styles.textfab}>Dịch vụ</Text>
        <Entypo name="camera" size={25} color={"white"} />
      </TouchableOpacity>
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
    position: "absolute",
    bottom: 100,
    right: 20,
    backgroundColor: "#0E55A7",
    padding: 10,
    borderRadius: 100,
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
});
