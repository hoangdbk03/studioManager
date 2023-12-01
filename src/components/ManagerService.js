import {
  StyleSheet,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import AxiosIntance from "../util/AxiosIntance";
import Toast from "react-native-toast-message";
import ItemListService from "./ItemListService";
import { Badge } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";
import { AppConText } from "../util/AppContext";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import { Modal } from "react-native-paper";
import { Text } from "react-native";
import { styleModal } from "../style/styleModal";

const ManagerService = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [numColumns, setNumColumns] = useState(2);
  const [cartCount, setCartCount] = useState(0);
  const { inforUser } = useContext(AppConText);
  const [isModalAdd, setModalAdd] = useState(false);

  const toggleModalAdd = () => {
    setModalAdd(!isModalAdd);
  };

  const [dataAdd, setDataAdd] = useState({
    image: "",
    name: "",
    description: "",
    price: "",
  });

  //màn hình giỏ hàng
  const navigateToCart = () => {
    navigation.navigate("Cart");
  };

  //gọi goback và màn hình giỏ hàng
  const handleCartPress = () => {
    navigation.goBack();
    navigateToCart();
  };

  //thêm dịch vụ vào giỏ hàng
  const handleAddToCart = () => {
    fetchCartCount();
  };
  //xóa dịch vụ khỏi giỏ hàng
  const handleRemoveFromCart = () => {
    fetchCartCount();
  };

  useEffect(() => {
    fetchData();
    fetchCartCount();
  }, []);

  // gọi api danh sách dịch vụ
  const fetchData = async () => {
    try {
      const response = await AxiosIntance().get("/service/list");
      const apiData = response;
      setData(apiData);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Không lấy được dữ liệu",
      });
    }
  };

  // gọi api thêm dịch vụ
  const addService = async () => {
    try {
      await AxiosIntance().post("/service/create/", addService);
      Toast.show({
        type: "success",
        text1: "Thêm thành công.",
      });
      fetchData();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Thêm thất bại.",
      });
    }
  };

  // gọi api giỏ hàng
  const fetchCartCount = async () => {
    const response = await AxiosIntance().get(`/cart/list/${inforUser._id}`);
    const cartData = response;
    const itemCount = Array.isArray(cartData.items) ? cartData.items.length : 0;
    setCartCount(itemCount);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        numColumns={numColumns}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ItemListService
            item={item}
            onAddToCart={() => handleAddToCart()}
            onRemoveFromCart={() => handleRemoveFromCart()}
          />
        )}
      />
      <TouchableOpacity
        style={styles.floatingCart}
        activeOpacity={0.6}
        onPress={handleCartPress}
      >
        <Feather
          name="shopping-cart"
          color="white"
          size={25}
          style={{ left: 3 }}
        />
        {cartCount > 0 && (
          <Badge style={styles.badge} size={20}>
            {cartCount}
          </Badge>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.floatingAdd} onPress={toggleModalAdd}>
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>
      <Modal visible={isModalAdd} style={styleModal.modalContainer}>
        <View style={styleModal.modalContent}>
          <View style={styleModal.frameTitleModal}>
            <Text style={styleModal.titleModal}>Thêm dịch vụ</Text>
          </View>
          <View style={styleModal.buttonModal}>
            <TouchableOpacity
              onPress={toggleModalAdd}
              style={styleModal.button1}
            >
              <Text style={styleModal.textButton1}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={handleUpdateItem}
              style={styleModal.button2}
            >
              <Text style={styleModal.textButton2}>Thêm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManagerService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  floatingCart: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#0E55A7",
    padding: 10,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    width: 56,
    height: 56,
  },
  badge: {
    position: "absolute",
    top: -1,
    right: -2,
    backgroundColor: "red",
  },
  floatingAdd: {
    position: "absolute",
    bottom: 20,
    left: 20,
    alignItems: "center",
    borderRadius: 100,
    justifyContent: "center",
    width: 56,
    height: 56,
    backgroundColor: "#0E55A7",
  },
});
