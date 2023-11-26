import { Image, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { AppConText } from "../util/AppContext";
import Toast from "react-native-toast-message";
import AxiosIntance from "../util/AxiosIntance";

const ItemListService = (props) => {
  const { item, onAddToCart, onRemoveFromCart } = props;
  const { inforUser } = useContext(AppConText);
  const [inCart, setInCart] = useState(false);

  const formatPrice = (price) => {
    const formattedPrice = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
    return formattedPrice.replace(/\s₫/g, "");
  };

  const addToCart = async () => {
    const idAddCart = {
      userID: inforUser._id,
      serviceID: item._id,
    };

    try {
      if (inCart) {
        await AxiosIntance().delete("/cart/removeServiceFromCart/",  {
          data: idAddCart,
        });
        onRemoveFromCart();
      } else {
        await AxiosIntance().post("/cart/addServiceToCart/", idAddCart);
        onAddToCart();
        Toast.show({
          type: "success",
          text1: "Thêm thành công vào giỏ hàng",
        });
        onAddToCart();
      }
      setInCart(!inCart);
    } catch (error) {
      Toast.show({
        type: "info",
        text1: "Dịch vụ đã tồn tại trong giỏ hàng",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: item.image }} />
      <View style={styles.infor}>
        <Text numberOfLines={2} style={styles.textName}>
          {item.name}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text>Giá </Text>
          <Text style={styles.textPrice}>{formatPrice(item.price)}₫</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.buttonAdd} onPress={addToCart}>
        <Text style={styles.textButton}>{inCart ? "Hủy" : "Thêm vào giỏ hàng"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ItemListService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e7eef6",
    padding: 10,
    margin: 10,
    borderRadius: 16,
    height: 350,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  infor: {
    height: "25%",
  },
  buttonAdd: {
    backgroundColor: "white",
    borderColor: "#0E55A7",
    borderWidth: 0.5,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  textButton: {
    color: "#0E55A7",
    fontWeight: "500",
  },
  textName: {
    fontSize: 15,
    fontWeight: "500",
    marginTop: 5,
    height: 50,
    color: "#0a3c77",
  },
});
