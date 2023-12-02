import {
  Image,
  Platform,
  StyleSheet,
  ToastAndroid,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
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
import Modal from "react-native-modal";
import { Text } from "react-native";
import { styleModal } from "../style/styleModal";
import * as ImagePicker from "expo-image-picker";

const ManagerService = () => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [numColumns, setNumColumns] = useState(2);
  const [cartCount, setCartCount] = useState(0);
  const { inforUser } = useContext(AppConText);
  const [imageUri, setImageUri] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // ! Modal
  const [isModalAdd, setModalAdd] = useState(false);
  const [isModalUpdate, setModalUpdate] = useState(false);
  const [isModalDel, setModalDel] = useState(false);

  // * lưu trữ dữ liệu thêm
  const [dataAdd, setDataAdd] = useState({
    name: "",
    description: "",
    price: "",
  });
  // * lưu trữ dữ liệu cập nhật
  const [dataEdit, setDataEdit] = useState({
    name: "",
    description: "",
    price: "",
  });
  // * hiển thị modal thêm dịch vụ
  const toggleModalAdd = () => {
    setModalAdd(!isModalAdd);
    if (!isModalAdd) {
      setImageUri(null);
    }
  };
  // * hiển thị modal cập nhật dịch vụ
  const toggleModalUpdate = () => {
    setModalUpdate(!isModalUpdate);
    if (!isModalUpdate) {
      setImageUri(null);
    }
  };
  // * hiển thị modal xác nhận xóa
  const toggleModalDel = () => {
    setModalDel(!isModalDel);
  };

  /**
   * TODO: Xử lý API
   */

  // TODO: xử lý thêm dịch vụ
  // * Mở thư viện chọn hình ảnh
  const openImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setDataAdd({ ...dataAdd, image: result.assets[0].uri });
      setSelectedItem((prevItem) => ({
        ...prevItem,
        image: result.assets[0].uri,
      }));
      setDataEdit((prevDataEdit) => ({
        ...prevDataEdit,
        image: result.assets[0].uri,
      }));
    }
  };
  // * xử lý api thêm
  const addService = async () => {
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append("name", dataAdd.name);
      formData.append("description", dataAdd.description);
      formData.append("price", dataAdd.price);

      // Check if an image is selected before appending to FormData
      if (imageUri) {
        const imageUriParts = imageUri.split(".");
        const imageFileType = imageUriParts[imageUriParts.length - 1];
        const imageName = `service_image_${Date.now()}.${imageFileType}`;
        formData.append("image", {
          uri: imageUri,
          name: imageName,
          type: `image/${imageFileType}`,
        });
      }

      await AxiosIntance().post("/service/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Toast.show({
        type: "success",
        text1: "Thêm thành công.",
      });
      toggleModalAdd();
      fetchData();
    } catch (error) {
      toggleModalAdd();
      console.log("Add Service Error: ", error);
      Toast.show({
        type: "error",
        text1: "Thêm thất bại.",
      });
    }
  };
  // TODO: Xử lý API cập nhật dịch vụ
  const updateService = async () => {
    try {
      const formData = new FormData();
      formData.append("name", dataEdit.name);
      formData.append("description", dataEdit.description);
      formData.append("price", dataEdit.price);

      // Check if an image is selected before appending to FormData
      if (imageUri) {
        const imageUriParts = imageUri.split(".");
        const imageFileType = imageUriParts[imageUriParts.length - 1];
        const imageName = `service_image_${Date.now()}.${imageFileType}`;
        formData.append("image", {
          uri: imageUri,
          name: imageName,
          type: `image/${imageFileType}`,
        });
      }

      await AxiosIntance().put(
        `/service/update/${selectedItem._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      Toast.show({
        type: "success",
        text1: "Cập nhật thành công",
      });
      toggleModalUpdate();
      fetchData();
    } catch (error) {
      console.log("Update error", error);
      Toast.show({
        type: "error",
        text1: "Cập nhật thất bại!",
      });
    }
  };
  // TODO: APi xóa dịch vụ theo id
  const deleteService = async () => {
    try {
      await AxiosIntance().delete(`/service/delete/`);
      Toast.show({
        type: "success",
        text1: "Xóa thành công dịch vụ",
      });
      fetchData();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Xóa thất bại",
      });
    }
  };
  const handleEditService = (item) => {
    setSelectedItem(item);
    toggleModalUpdate();
  };

  // TODO: Xử lý API lấy danh sách dịch vụ
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
  // TODO: Xử lý API gọi danh sách giỏ hàng
  const fetchCartCount = async () => {
    try {
      const response = await AxiosIntance().get(`/cart/list/${inforUser._id}`);
      const cartData = response;
      const itemCount = Array.isArray(cartData.items)
        ? cartData.items.length
        : 0;
      setCartCount(itemCount);
    } catch (error) {}
  };

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
    if (selectedItem) {
      setDataEdit({
        name: selectedItem.name,
        description: selectedItem.description,
        price: selectedItem.price.toString(),
      });
    }
  }, [selectedItem]);

  useEffect(() => {
    fetchData();
    fetchCartCount();
  }, []);

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
            onEdit={handleEditService}
            // onDelete={handleDeleteService}
          />
        )}
      />
      {inforUser.role === "Nhân viên" ? null : (
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
      )}
      {inforUser.role === "Nhân viên" ? null : (
        <TouchableOpacity style={styles.floatingAdd} onPress={toggleModalAdd}>
          <MaterialIcons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}

      {/* Modal thêm dịch vụ */}
      <Modal isVisible={isModalAdd} style={styleModal.modalContainer}>
        <View style={styleModal.modalContent}>
          <View style={styles.frameImage}>
            <TouchableNativeFeedback onPress={() => openImageLibrary()}>
              {imageUri ? (
                <Image style={styles.imgAdd} source={{ uri: imageUri }} />
              ) : (
                <Image
                  style={styles.imgAddNull}
                  source={require("../img/frame-add.png")}
                />
              )}
            </TouchableNativeFeedback>
          </View>

          <TextInput
            style={styleModal.textInput}
            onChangeText={(text) => setDataAdd({ ...dataAdd, name: text })}
            mode="outlined"
            label="Tên dịch vụ"
          />

          <TextInput
            style={styleModal.textInput}
            onChangeText={(text) => {
              setDataAdd({ ...dataAdd, price: text });
            }}
            mode="outlined"
            label="Giá tiền"
            keyboardType="numeric"
          />

          <TextInput
            style={styleModal.textInput}
            // onChangeText={(text) => setDataAdd({ ...dataAdd, name: text })}
            mode="outlined"
            label="Số lượng ảnh"
          />

          <TextInput
            style={[styleModal.textInput, { height: 200 }]}
            onChangeText={(text) =>
              setDataAdd({ ...dataAdd, description: text })
            }
            mode="outlined"
            label="Mô tả"
            multiline={true}
          />

          <View style={styleModal.buttonModal}>
            <TouchableOpacity
              onPress={toggleModalAdd}
              style={styleModal.button1}
            >
              <Text style={styleModal.textButton1}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addService} style={styleModal.button2}>
              <Text style={styleModal.textButton2}>Thêm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal cập nhật dịch vụ */}
      <Modal isVisible={isModalUpdate} style={styleModal.modalContainer}>
        <View style={styleModal.modalContent}>
          <TouchableNativeFeedback onPress={() => openImageLibrary()}>
            <View style={styles.frameImage}>
              <Image
                style={styles.imgAdd}
                source={{
                  uri: selectedItem ? selectedItem.image : null,
                }}
              />
            </View>
          </TouchableNativeFeedback>

          <TextInput
            style={styleModal.textInput}
            value={dataEdit.name}
            onChangeText={(text) => setDataEdit({ ...dataEdit, name: text })}
            mode="outlined"
            label="Tên dịch vụ"
          />

          <TextInput
            style={styleModal.textInput}
            value={dataEdit.price}
            onChangeText={(text) => setDataEdit({ ...dataEdit, price: text })}
            mode="outlined"
            label="Giá tiền"
          />

          <TextInput
            style={styleModal.textInput}
            value={dataEdit.description}
            onChangeText={(text) =>
              setDataEdit({ ...dataEdit, description: text })
            }
            mode="outlined"
            label="Mô tả"
          />

          <View style={styleModal.buttonModal}>
            <TouchableOpacity
              onPress={toggleModalUpdate}
              style={styleModal.button1}
            >
              <Text style={styleModal.textButton1}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={updateService}
              style={styleModal.button2}
            >
              <Text style={styleModal.textButton2}>Cập nhật</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal xóa */}
      <Modal isVisible={isModalDel} style={styleModal.modalContainer}>
        <View style={styleModal.modalContent}>
          <View>
            <Text>Bạn chắc chắn muốn xóa?</Text>
          </View>
          <View style={styleModal.buttonModal}>
            <TouchableOpacity
              onPress={toggleModalDel}
              style={styleModal.button1}
            >
              <Text style={styleModal.textButton1}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={deleteService}
              style={styleModal.button2}
            >
              <Text style={styleModal.textButton2}>Đồng ý</Text>
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
  imgAddNull: {
    width: 80,
    height: 80,
  },
  imgAdd: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  frameImage: {
    width: 200,
    height: 200,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7fbff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
