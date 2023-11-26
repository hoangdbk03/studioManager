import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import AxiosIntance from "../util/AxiosIntance";
import Toast from "react-native-toast-message";
import ItemListService from "./ItemListService";
import { Badge } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";
import { AppConText } from "../util/AppContext";

const ManagerService = () => {
  const [data, setData] = useState([]);
  const [numColumns, setNumColumns] = useState(2);
  const [cartCount, setCartCount] = useState(0);
  const {inforUser} = useContext(AppConText);

  const handleAddToCart = () => {
    fetchCartCount();
  };

  const handleRemoveFromCart = () => {
    fetchCartCount();
  };

  useEffect(() => {
    fetchData();
    fetchCartCount();
  }, []);

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
          <ItemListService item={item} onAddToCart={() => handleAddToCart()}
          onRemoveFromCart={() => handleRemoveFromCart()}/>
        )}
      />
      <TouchableOpacity style={styles.floatingCart}>
        <Feather
          name="shopping-cart"
          color="white"
          size={25}
          style={{left: 3}}
        />
        {cartCount > 0 && (
          <Badge
            style={styles.badge}
            size={20}
          >
            {cartCount}
          </Badge>
        )}
      </TouchableOpacity>
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
    backgroundColor: "#0E55A7", // Change this to the desired background color
    padding: 10,
    borderRadius: 100,
    flexDirection: "row",
    alignItems: "center",
    width: 56,
    height: 56
  },
  badge: {
    position: "absolute",
    top: -1,
    right: -2,
    backgroundColor: "red", // Change this to the desired badge background color
  },
});
