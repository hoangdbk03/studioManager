import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState, useMemo } from "react";
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
  const [refreshing, setRefreshing] = useState(false);

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
    const formattedDate = format(date, "dd/MM/yyyy");
    setSearchQuery(formattedDate);
    setSelectedDate(date);
  };

  const filterByDate = (item) =>
    item.started.toLowerCase().includes(searchQuery.toLowerCase());

  const filterByClient = (item) =>
    item.client.name.toLowerCase().includes(searchQuery.toLowerCase());

  const filterByService = (item) =>
    item.services.some((service) =>
      service.serviceID.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filterData = useMemo(() => {
    return dataListOrder.filter(
      (item) => filterByDate(item) || filterByClient(item) || filterByService(item)
    );
  }, [searchQuery, dataListOrder]);

  const fetchDataOrder = async () => {
    try {
      const response = await AxiosIntance().get("/order/list");
      const apiData = response;

      const filteredData =
        inforUser.role === "Nhân viên"
          ? apiData.filter((order) =>
              order.staffs.some((staff) => staff.staffID._id === inforUser._id)
            )
          : apiData;

      setDataListOrder(filteredData);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDataOrder();
  }, [searchQuery, refreshing]);

  const handleRefreshData = () => {
    setRefreshing(true);
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

      {filterData.length > 0 ? (
        <FlatList
          refreshing={refreshing}
          onRefresh={handleRefreshData}
          style={{ marginBottom: "21%" }}
          data={filterData}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ItemListJob_role item={item} loadData={handleRefreshData} />
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
