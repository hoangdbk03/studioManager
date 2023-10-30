import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AxiosIntance from "../util/AxiosIntance";
import Toast from "react-native-toast-message";
import ItemListClientAdmin from "./ItemListClientAdmin";
import Modal from "react-native-modal";
import { TextInput } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

const ManagerClient = () => {
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [data, setdata] = useState([]);

  //lưu giá trị được thêm
  const [addData, setaddData] = useState({
    name: '',
    address: '',
    phone: '',
  });

  //lưu giá trị cập nhật
  const [editedData, setEditedData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const toggleAddModal = ()=>{
    setAddModalVisible(!isAddModalVisible);
  }

  const toggleUpdateModal = () => {
    setUpdateModalVisible(!isUpdateModalVisible);
  };

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

  const handleAddClient = async() =>{
    try {
      await AxiosIntance().post('/client/create', addData);
      Toast.show({
        type: "success",
        text1: "Thêm thành công"
      });
      toggleAddModal();
      fetchData();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Thêm thất bại',
      });
    }
  }

  const handleUpdateItem = async () => {
    try {
      await AxiosIntance().put("/client/update/" + editedData._id, editedData);
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
  };

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
          <MaterialIcons name="add" size={30} color="white"/>
      </TouchableOpacity>

      {/* Modal thêm thông tin khách hàng mới */}
      <Modal isVisible={isAddModalVisible}>
      <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            
            {/* Tạo các TextInput để chỉnh sửa thông tin ở đây */}
            <TextInput
              style={styles.textInput}
              onChangeText={(text) =>
                setaddData({ ...addData, name: text })
              }
              mode="outlined"
              label="Họ và tên"
            />
            <TextInput
              style={styles.textInput}
              onChangeText={(text) =>
                setaddData({ ...addData, address: text })
              }
              mode="outlined"
              label="Địa chỉ"
            />
            <TextInput
              style={styles.textInput}
              onChangeText={(text) =>
                setaddData({ ...addData, phone: text })
              }
              mode="outlined"
              label="Số điện thoại"
              keyboardType="numeric"
            />
            <View style={styles.button}>
              <TouchableOpacity
                onPress={toggleAddModal}
                style={styles.buttonItem}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <Text style={{ width: 10 }} />
              <TouchableOpacity
                onPress={handleAddClient}
                style={styles.buttonItem}
              >
                <Text>Thêm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal chỉnh sửa thông tin */}
      <Modal isVisible={isUpdateModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            
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
            <View style={styles.button}>
              <TouchableOpacity
                onPress={toggleUpdateModal}
                style={styles.buttonItem}
              >
                <Text>Hủy</Text>
              </TouchableOpacity>
              <Text style={{ width: 10 }} />
              <TouchableOpacity
                onPress={handleUpdateItem}
                style={styles.buttonItem}
              >
                <Text>Cập nhật</Text>
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
  container:{
    backgroundColor: 'white',
    flex: 1
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    width: '100%'
  },
  buttonItem: {
    borderWidth: 0.5,
    padding: 8,
  },
  button: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "flex-end",
  },
  textInput: {
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#0E55A7',
    borderRadius: 30,
    elevation: 8,
  },
});
