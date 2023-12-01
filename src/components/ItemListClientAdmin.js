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
import { styleModal } from "../style/styleModal";

const ItemListClientAdmin = (props) => {
  //truyền item và index
  const { item, index } = props;
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  //ẩn modal
  const toggleDeleteModal = () => {
    setDeleteModalVisible(!isDeleteModalVisible);
  };

  //truyền item._id đi 
  const handleDelete = () => {
    props.onDelete(item._id);
    toggleDeleteModal();
  };

  //phần front-end
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", color: '#0E55A7' }}>{index + 1}</Text>
      <View style={styles.infor}>
        <Text style={{ color: "#313e4d"}}>
          {item.name}
        </Text>
        <Text style={{ color: "#313e4d"}}>{item.phone}</Text>
      </View>
      <TouchableOpacity onPress={toggleDeleteModal}>
        <MaterialIcons name="delete" size={25} color={"#fc6261"} />
      </TouchableOpacity>
      <Modal isVisible={isDeleteModalVisible} style={styleModal.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.textModal}>
            <Text style={{color: '#fc6261', fontWeight: 'bold'}}>Bạn chắc chắn muốn xóa khách hàng</Text>
            <Text>{item.name}</Text>
          </View>
          <View style={styleModal.buttonModal}>
            <TouchableOpacity
              onPress={toggleDeleteModal}
              style={styleModal.button1}
            >
              <Text style={styleModal.textButton1}>Không</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styleModal.button2}>
              <Text style={styleModal.textButton2}>Đồng ý</Text>
            </TouchableOpacity>
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
    backgroundColor: "#e7eef6",
    padding: 20,
    marginTop: 10,
    borderColor: "#cfcfcf",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10
  },
  infor: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '80%',
  },
  textModal: {
    padding: 10,
    alignItems: 'center'
  },
  modalContent:{
    backgroundColor: "white",
    borderRadius: 5,
    width: '100%'
  },
  
});
