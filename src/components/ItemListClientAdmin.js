import {
  Button,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Modal from "react-native-modal";

const ItemListClientAdmin = (props) => {
  const { item, index } = props;
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const toggleDeleteModal = () => {
    setDeleteModalVisible(!isDeleteModalVisible);
  };

  const handleDelete = () => {
    props.onDelete(item._id);
    toggleDeleteModal();
  };

  return (
    <View style={styles.container}>
      <Text>{index + 1}</Text>
      <View style={styles.infor}>
        <Text>{item.name}</Text>
        <Text>{item.phone}</Text>
      </View>
      <TouchableOpacity onPress={toggleDeleteModal}>
        <MaterialIcons name="delete" size={20} />
      </TouchableOpacity>
      <Modal isVisible={isDeleteModalVisible} style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.textModal}>Xác nhận</Text>
          <Text>Xóa khách hàng {item.name}</Text>
          <View style={styles.buttonModal}>
            <Text style={styles.button} onPress={toggleDeleteModal}>
              Hủy
            </Text>
            <Text style={{ width: 20 }} />
            <Text style={styles.button} onPress={handleDelete}>
              Xác nhận
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ItemListClientAdmin;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#cfcfcf",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infor: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 230,
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
    width: 300,
  },
  buttonModal: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  textModal: {
    fontSize: 18,
    color: "red",
    fontWeight: "bold",
  },
  button: {
    borderWidth: 0.5,
    padding: 8,
  },
});
