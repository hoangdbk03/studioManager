import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AxiosIntance from "../util/AxiosIntance";
import Toast from "react-native-toast-message";
import {Modal} from "react-native-paper";
import { TextInput } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { AppConText } from "../util/AppContext";
import { styleModal } from "../style/styleModal";
import ItemListClientAdmin from "./ItemListClientAdmin";

const ManagerClient = () => {
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [data, setdata] = useState([]);
  const { inforUser } = useContext(AppConText);

  //lưu giá trị được thêm
  const [addData, setaddData] = useState({
    name: "",
    address: "",
    phone: "",
    creatorID: inforUser._id,
  });

  //lưu giá trị cập nhật
  const [editedData, setEditedData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  //ẩn modal
  const toggleAddModal = () => {
    setAddModalVisible(!isAddModalVisible);
  };
  const toggleUpdateModal = () => {
    setUpdateModalVisible(!isUpdateModalVisible);
  };

  //lấy danh sách khách hàng
  const fetchData = async () => {
    try {
      const response = await AxiosIntance().get("/client/list/");
      const apiData = response;
      setdata(apiData);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Đã xảy ra lỗi",
      });
    }
  };

  // xử lý thêm dữ liệu
  const handleAddClient = async () => {
    if (
      addData.name.trim() === "" ||
      addData.address.trim() === "" ||
      addData.phone.trim() === ""
    ) {
      toggleAddModal();
      Toast.show({
        type: "info",
        text1: "Vui lòng nhập đầy đủ thông tin!",
      });
    } else {
      try {
        await AxiosIntance().post("/client/create", addData);
        Toast.show({
          type: "success",
          text1: "Thêm thành công",
        });
        toggleAddModal();
        fetchData();
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Thêm thất bại",
        });
      }
    }
  };

  // xử lý cập nhật dữ liệu
  const handleUpdateItem = async () => {
    if (
      editedData.name.trim() === "" ||
      editedData.address.trim() === "" ||
      editedData.phone.trim() === ""
    ) {
      toggleUpdateModal();
      Toast.show({
        type: "info",
        text1: "Vui lòng nhập đầy đủ thông tin!",
      });
    } else {
      try {
        await AxiosIntance().put(
          "/client/update/" + editedData._id,
          editedData
        );
        Toast.show({
          type: "success",
          text1: "Cập nhật thành công",
        });
        fetchData(); // Cập nhật danh sách dữ liệu sau khi cập nhật
        toggleUpdateModal();
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Cập nhật thất bại",
        });
      }
    }
  };

  //xử lý xóa dữ liệu
  const handleDeleteItem = async (itemId) => {
    try {
      await AxiosIntance().delete("/client/delete/" + itemId);
      Toast.show({
        type: "success",
        text1: "Xóa thành công",
      });
      fetchData(); // Cập nhật danh sách dữ liệu sau khi xóa
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Xóa thất bại",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //phần front-end
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              setEditedData({ ...item });
              toggleUpdateModal();
            }}
          >
            <ItemListClientAdmin
              item={item}
              index={index}
              onDelete={handleDeleteItem}
            />
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={toggleAddModal}>
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>

      {/* Modal thêm thông tin khách hàng mới */}
      <Modal visible={isAddModalVisible}  style={styleModal.modalContainer}>
        <View>
          <View style={styleModal.modalContent}>
            <View style={styleModal.frameTitleModal}>
              <Text style={styleModal.titleModal}>Thêm khách hàng mới</Text>
            </View>

            {/* Tạo các TextInput để thêm mới*/}
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setaddData({ ...addData, name: text })}
              mode="outlined"
              label="Họ và tên"
            />
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setaddData({ ...addData, address: text })}
              mode="outlined"
              label="Địa chỉ"
            />
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setaddData({ ...addData, phone: text })}
              mode="outlined"
              label="Số điện thoại"
              keyboardType="numeric"
            />
            <View style={styleModal.buttonModal}>
              <TouchableOpacity
                onPress={toggleAddModal}
                style={styleModal.button1}
              >
                <Text style={styleModal.textButton1}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddClient}
                style={styleModal.button2}
              >
                <Text style={styleModal.textButton2}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal chỉnh sửa thông tin */}
      <Modal visible={isUpdateModalVisible}  style={styleModal.modalContainer}>
        <View>
          <View style={styleModal.modalContent}>
            <View style={styleModal.frameTitleModal}>
              <Text style={styleModal.titleModal}>Cập nhật khách hàng</Text>
            </View>
            {/* Tạo các TextInput để chỉnh sửa thông tin ở đây */}
            <TextInput
              style={styles.textInput}
              value={editedData.name}
              onChangeText={(text) =>
                setEditedData({ ...editedData, name: text })
              }
              mode="outlined"
              label="Họ và tên"
            />
            <TextInput
              style={styles.textInput}
              value={editedData.address}
              onChangeText={(text) =>
                setEditedData({ ...editedData, address: text })
              }
              mode="outlined"
              label="Địa chỉ"
            />
            <TextInput
              style={styles.textInput}
              value={editedData.phone}
              onChangeText={(text) =>
                setEditedData({ ...editedData, phone: text })
              }
              mode="outlined"
              label="Số điện thoại"
              keyboardType="numeric"
            />
            <View style={styleModal.buttonModal}>
              <TouchableOpacity
                onPress={toggleUpdateModal}
                style={styleModal.button1}
              >
                <Text style={styleModal.textButton1}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUpdateItem}
                style={styleModal.button2}
              >
                <Text style={styleModal.textButton2}>Cập nhật</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManagerClient;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 10
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    alignItems: "center",
    borderRadius: 5,
    width: "100%",
  },
  textInput: {
    marginTop: 10,
    width: "90%",
    backgroundColor: '#f7fbff'
  },
  fab: {
    position: "absolute",
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
    backgroundColor: "#0E55A7",
    borderRadius: 30,
    elevation: 8,
  },
});
