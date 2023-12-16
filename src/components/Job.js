import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AxiosIntance from "../util/AxiosIntance";
import ItemListJob from "./ItemListJob";
import { AppConText } from "../util/AppContext";
import ItemListJob_role from "./ItemListJob_role";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { IconButton, Searchbar } from "react-native-paper";
import { format } from "date-fns";

const Job = () => {
  const [dataListOrder, setDataListOrder] = useState([]);
  const { inforUser } = useContext(AppConText);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setrefreshing] = useState(false);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDateConfirm = (date) => {
    hideDatePicker();
    // Format the selected date as dd/MM/yyyy
    const formattedDate = format(date, "dd/MM/yyyy");
    // Set the selected date to the Searchbar
    setSearchQuery(formattedDate);
    setSelectedDate(date);
  };

  // Tìm kiếm theo ngày, tên dịch vụ và khách hàng
  const filterData = (data) => {
    return data.filter(
      (item) =>
        item.started.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.services.some((service) =>
          service.serviceID.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
    );
  };

  // TODO:  Xử lý api gọi danh sách đơn hàng
  const fetchDataOrder = async () => {
    try {
      const response = await AxiosIntance().get("/order/list");
      const apiData = response;

      // lọc theo role nhân viên
      const filteredData =
        inforUser.role === "Nhân viên"
          ? apiData.filter((order) =>
              order.staffs.some((staff) => staff.staffID._id === inforUser._id)
            )
          : apiData;

      setDataListOrder(filteredData);
      setrefreshing(false);
    } catch (error) {
      // Handle error
      console.error("Error fetching data:", error);
      setrefreshing(false);
    }
  };
  useEffect(() => {
    fetchDataOrder();
  }, [dataListOrder]);

  // load lại data
  const handleRefreshData = () => {
    setrefreshing(true);
    fetchDataOrder();
  };

  return (
    <View style={styles.container}>
      {inforUser.role === "Nhân viên" ? (
        <Text style={styles.title}>Công việc của bạn</Text>
      ) : (
        <Text style={styles.title}>Tất cả công việc</Text>
      )}

      <Searchbar
        placeholder="Tìm kiếm"
        onChangeText={handleSearch}
        value={searchQuery}
        style={{ borderRadius: 10, marginBottom: 10 }}
        icon={() => <IconButton icon="calendar" onPress={showDatePicker} />}
      />

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />

      {filterData(dataListOrder).length > 0 ? (
        <FlatList
          refreshing={refreshing}
          onRefresh={handleRefreshData}
          initialNumToRender={5} // Số lượng mục hiển thị ban đầu
          onEndReached={fetchDataOrder}
          style={{ marginBottom: "21%" }}
          data={filterData(dataListOrder)}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ItemListJob_role item={item} loadData={fetchDataOrder} />
          )}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              width: 150,
              height: 150,
              backgroundColor: "#e7eef6",
              borderRadius: 300,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{ width: 60, height: 60, tintColor: "#b4cae4" }}
              source={require("../img/taskList.png")}
            />
          </View>
          <Text style={{ color: "#545454", marginTop: 10 }}>
            Chưa có công việc
          </Text>
        </View>
      )}
    </View>
  );
};

export default Job;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
});
