import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useState } from "react";
import { ScrollView } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AxiosIntance from "../util/AxiosIntance";
import { AppConText } from "../util/AppContext";
import Modal from "react-native-modal";
import { styleModal } from "../style/styleModal";

const ItemListJob_role = (props) => {
  const { item } = props;
  const [selectedStatus, setSelectedStatus] = useState(item.status);
  const { inforUser } = useContext(AppConText);
  const [isModalVisible, setModalVisible] = useState(false);

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
              <Text style={{ marginTop: 5 }}>{item.status}</Text>
            ) : (
              <Dropdown
                style={[
                  styles.dropdown,
                  {
                    borderColor:
                      item.status === "Hoàn thành" || item.status === "Đã hủy"
                        ? "#e6e6e6"
                        : "#8a8a8a",
                  },
                ]}
                data={statusOptions}
                value={selectedStatus}
                disable={
                  item.status === "Hoàn thành" || item.status === "Đã hủy"
                }
                labelField="label"
                valueField="value"
                selectedTextStyle={{
                  fontSize: 13,
                  fontWeight: "500",
                  color:
                    item.status === "Hoàn thành" || item.status === "Đã hủy"
                      ? "#b0b0b0"
                      : "black",
                }}
                onChange={(newStatus) => {
                  handleStatusUpdate(newStatus.label);
                  setSelectedStatus(newStatus);
                }}
                itemTextStyle={styles.dropdownLabel}
              />
            )}
          </View>
          <View style={{ height: 1, backgroundColor: "#e6e6e6" }}></View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ marginTop: 5, color: "#b0b0b0" }}>
              Thời gian: {item.started}
            </Text>
            <TouchableOpacity
              style={{ marginTop: 5 }}
              onPress={() => setModalVisible(true)}
            >
              <Text style={{ color: "#0E55A7", fontWeight: 'bold' }}>Chi tiết...</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal chi tiết đơn hàng */}
      <Modal isVisible={isModalVisible} /* Other modal props go here */>
        <View style={styles.modalContent}>
          {item.services.map((service) => (
            <View key={service._id} style={{ flexDirection: "row" }}>
              <Image
                source={{ uri: service.serviceID.image }}
                style={{ width: 100, height: 100 }}
              />
              <View style={{ marginStart: 10 }}>
                <Text style={styles.nameService}>{service.serviceID.name}</Text>
                <Text style={styles.priceService}>
                  {service.serviceID.price}
                </Text>
                <Text style={styles.description}>
                  {service.serviceID.description}
                </Text>
              </View>
            </View>
          ))}

          <Text>{item.client.name}</Text>
          <Text>{item.client.phone}</Text>
          <Text>{item.client.gender}</Text>

          {item.staffs.map((staff) => (
            <View key={staff._id}>
              <Text>
                {staff.staffID.name} - {staff.staffID.job}
              </Text>
            </View>
          ))}

          <Text>{item.location}</Text>
          <Text>{item.note}</Text>
          <Text>{item.started}</Text>
          <Text>{item.deadline}</Text>
          <Text>{item.createdAt}</Text>

          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={{ color: "#0E55A7" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    borderWidth: 1.5,
    borderRadius: 5,
    padding: 5,
    height: 30,
    marginBottom: 10,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  description: {
    color: "#545454",
  },
  priceService: {
    color: "#545454",
  },
  nameService: {
    fontSize: 18,
    fontWeight: "500",
  },
});
