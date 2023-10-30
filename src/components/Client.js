import {
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AxiosIntance from "../util/AxiosIntance";
import ItemListClient from "./ItemListClient";
import Modal1 from "react-native-modal";
import Toast from "react-native-toast-message";

const Client = () => {
  const [data, setdata] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedData, setselectedData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  //gọi api
  const fetchData = async () => {
    try {
      const response = await AxiosIntance().get("/client/list/");
      const apiData = response;
      setdata(apiData);
      setRefreshing(false);
    } catch (error) {
      ToastAndroid.show("Lỗi gọi API", ToastAndroid.SHORT);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //xử lý load lại data
  const handleRefreshData = () => {
    setRefreshing(true);
    fetchData();
    Toast.show({
      type: "success",
      text1: "Cập nhật thành công",
    });
  };

  //hiển thị modal chi tiết của item được nhấn
  const openModal = (itemId) => {
    const selectedItem = data.find((item) => item._id === itemId);
    setselectedData(selectedItem);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.title}>
        <Text style={styles.text}>STT</Text>
        <Text style={styles.text}>Họ và tên</Text>
        <Text style={styles.text}>Số điện thoại</Text>
      </View>

      {/* Danh sách khách hàng */}
      <FlatList
        refreshing={refreshing}
        onRefresh={handleRefreshData}
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => openModal(item._id)}>
            <ItemListClient item={item} index={index} />
          </TouchableOpacity>
        )}
      />

      {/* Modal chi tiết của item */}
      <Modal1 isVisible={isModalVisible}>
        <View
          style={{
            backgroundColor: "white",
            padding: 10,
            borderRadius: 5,
          }}
        >
          <View style={styles.titleModal}>
            <Text style={{ fontSize: 20, color: "white", fontWeight: "500" }}>
              Thông tin của khách hàng
            </Text>
          </View>

          {selectedData ? (
            <>
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textModalStyle}>Tên: </Text>
                <Text style={styles.textModalStyle}>{selectedData.name}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textModalStyle}>Số điện thoại: </Text>
                <Text style={styles.textModalStyle}>{selectedData.phone}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textModalStyle}>Địa chỉ: </Text>
                <Text style={styles.textModalStyle}>
                  {selectedData.address}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textModalStyle}>Người tạo: </Text>
                <Text style={styles.textModalStyle}>
                  {selectedData.creatorID}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.textModalStyle}>Ngày tạo: </Text>
                <Text style={styles.textModalStyle}>
                  {selectedData.datejoin}
                </Text>
              </View>
            </>
          ) : null}
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{
              marginTop: 20,
              height: 30,
              backgroundColor: "red",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 20, color: "white", fontWeight: "bold" }}>
              Đóng
            </Text>
          </TouchableOpacity>
        </View>
      </Modal1>
    </View>
  );
};

export default Client;

const styles = StyleSheet.create({
  titleModal: {
    backgroundColor: "#0E55A7",
    width: "100%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  text: {
    fontWeight: "bold",
  },
  title: {
    flexDirection: "row",
    padding: 20,
    justifyContent: "space-between",
  },
});
