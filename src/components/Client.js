import {
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
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
import { format, parseISO } from "date-fns";
import { Searchbar } from "react-native-paper";
import unorm from "unorm";

const Client = () => {
  // * nơi lưu danh sách khách hàng
  const [data, setdata] = useState([]);
  // * xử lý hiển thị modal
  const [isModalVisible, setModalVisible] = useState(false);
  // * nơi lưu thông tin của item khách hàng
  const [selectedData, setselectedData] = useState(null);
  // * xử lý load trang
  const [refreshing, setRefreshing] = useState(false);
  // * xử lý skeleton
  const [loading, setLoading] = useState(true);
  // * xử lý tìm kiếm
  const [searchQuery, setSearchQuery] = React.useState("");


  // TODO: 
  const dateTimeString = selectedData ? selectedData.createdAt : null;

  const dateTime = dateTimeString ? parseISO(dateTimeString) : null;
  const formattedDateTime = dateTime
    ? format(dateTime, "dd/MM/yyyy HH:mm:ss")
    : null;

  //gọi api danh sách khách hàng
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

  const onChangeSearch = (query) => setSearchQuery(query);

  // Chuẩn hóa chuỗi sang Unicode NFD
  const normalizedSearchQuery = unorm.nfkd(searchQuery.toLowerCase());

  // Lọc dữ liệu dựa trên chuỗi tìm kiếm đã được chuẩn hóa
  const filteredData = data.filter((item) => {
    const normalizedDataName = unorm.nfkd(item.name.toLowerCase());
    const normalizedDataPhone = unorm.nfkd(item.phone.toLowerCase());

    return (
      normalizedDataName.includes(normalizedSearchQuery) ||
      normalizedDataPhone.includes(normalizedSearchQuery)
    );
  });

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Tìm kiếm"
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      <FlatList
        style={{ marginBottom: "21%" }}
        refreshing={refreshing}
        onRefresh={handleRefreshData}
        data={filteredData}
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
                <Text style={styles.textModalStyle}>Thời gian tạo: </Text>
                <Text style={styles.textModalStyle}>{formattedDateTime}</Text>
              </View>
            </>
          ) : null}
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={styles.button2}
          >
            <Text style={{ color: "#0E55A7", fontWeight: "bold" }}>ĐÓNG</Text>
          </TouchableOpacity>
        </View>
      </Modal1>
    </View>
  );
};

export default Client;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  titleModal: {
    backgroundColor: "#0E55A7",
    width: "100%",
    height: 50,
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
  button2: {
    borderWidth: 1,
    width: "100%",
    padding: 15,
    alignItems: "center",
    borderColor: "#dbdbdb",
    marginTop: 20,
  },
  searchBar: {
    borderRadius: 10,
  },
});
