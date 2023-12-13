import { Image, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { ScrollView } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AxiosIntance from "../util/AxiosIntance";
import { AppConText } from "../util/AppContext";

const ItemListJob_role = (props) => {
  const { item } = props;
  const [selectedStatus, setSelectedStatus] = useState(item.status);
  const { inforUser } = useContext(AppConText);

  let statusBackgroundColor;

  // * kiểm tra màu trạng thái
  if (item.status === "Chưa thực hiện") {
    statusBackgroundColor = "red";
  } else if (item.status === "Đang thực hiện") {
    statusBackgroundColor = "#b59700";
  } else if (item.status === "Hoàn thành") {
    statusBackgroundColor = "green";
  } else if (item.status === "Đã hủy") {
    statusBackgroundColor = "#b0b0b0";
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await AxiosIntance().put(`/order/update/${item._id}`, {
        status: newStatus,
      });

      if (response.status === 200) {
        setSelectedStatus(newStatus);
      }
    } catch (error) {
      console.log("hi", newStatus);
      console.error("Error updating status:", error);
    }
  };

  const statusOptions = [
    { label: "Chưa thực hiện", value: "Chưa thực hiện" },
    { label: "Đang thực hiện", value: "Đang thực hiện" },
    { label: "Hoàn thành", value: "Hoàn thành" },
    { label: "Đã hủy", value: "Đã hủy" },
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.status, { backgroundColor: statusBackgroundColor }]}>
        <View style={styles.container1}>
          {item.services.map((service) => (
            <View key={service._id} style={styles.serviceContainer}>
              <Text style={styles.textNameService}>
                {service.serviceID.name}
              </Text>
            </View>
          ))}

          <Text style={{ color: "#8a8a8a" }}>
            Khách hàng: {item.client.name}
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.avatarList}
          >
            {item.staffs.map((staff) => (
              <View key={staff._id} style={styles.staffContainer}>
                <Image
                  style={styles.serviceImage}
                  source={{ uri: staff.staffID.avatar }}
                />
              </View>
            ))}
          </ScrollView>

          <View style={{ width: "100%", alignItems: "flex-end" }}>
            {inforUser.role === "Nhân viên" ? (
              <Text style={{ marginTop: 5}}>
                {item.status}
              </Text>
            ) : (
              <Dropdown
                style={styles.dropdown}
                data={statusOptions}
                value={selectedStatus}
                labelField="label"
                valueField="value"
                onChange={(newStatus) => {
                  handleStatusUpdate(newStatus.label);
                  setSelectedStatus(newStatus);
                }}
                itemTextStyle={styles.dropdownLabel}
              />
            )}
          </View>
          <View style={{ height: 1, backgroundColor: "#e6e6e6" }}></View>
          <Text style={{ marginTop: 5, color: "#b0b0b0" }}>
            Thời gian: {item.started}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ItemListJob_role;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  status: {
    borderRadius: 16,
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: "#e6e6e6",
  },
  container1: {
    backgroundColor: "white",
    padding: 10,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  serviceImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
    flexDirection: "row",
  },
  staffContainer: {
    width: 31,
    height: 31,
    backgroundColor: "white",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: -12,
  },
  avatarList: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  textNameService: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1f2633",
  },
  textStatus: {
    alignSelf: "flex-end",
    color: "#545454",
  },
  dropdown: {
    width: 150,
  },
});
