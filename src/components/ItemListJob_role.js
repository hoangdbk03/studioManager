import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useState } from "react";
import { ScrollView } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AxiosIntance from "../util/AxiosIntance";
import { AppConText } from "../util/AppContext";
import Modal from "react-native-modal";
import { styleModal } from "../style/styleModal";
import Toast from "react-native-toast-message";

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
      Toast.show({
        type: "success",
        text1: "Cập nhật trạng thái thành công",
      });
      props.loadData();
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

  // định dạng tiền việt
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });

    return formatter.format(amount);
  };

  // định dạng lại ngày
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

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

          <Text style={{ color: "black" }}>Khách hàng: {item.client.name}</Text>

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
            <Text
              style={{ marginTop: 5, color: "#0E55A7", fontWeight: "bold" }}
            >
              Thời gian: {item.started}
            </Text>
            <TouchableOpacity
              style={{ marginTop: 5 }}
              onPress={() => setModalVisible(true)}
            >
              <Text style={{ color: "#0E55A7", fontWeight: "bold" }}>
                Chi tiết...
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Modal chi tiết đơn hàng */}
      <Modal isVisible={isModalVisible}>
        <View style={modalStyles.modalContent}>
          <View style={modalStyles.headerContainer}>
            <Text style={modalStyles.headerText}>CHI TIẾT CÔNG VIỆC</Text>
          </View>
          <Text style={modalStyles.headerText}>
            Bắt đầu vào: {item.started}
          </Text>
          {item.services.map((service) => (
            <View key={service._id} style={modalStyles.serviceContainer}>
              <Image
                source={{ uri: service.serviceID.image }}
                style={modalStyles.serviceImage}
              />
              <View style={{ flex: 1 }}>
                <Text style={modalStyles.serviceName}>
                  {service.serviceID.name}
                </Text>
                <Text style={modalStyles.servicePrice}>
                  Giá: {formatCurrency(service.serviceID.price)}
                </Text>
                <Text style={modalStyles.serviceDescription}>
                  {service.serviceID.description}
                </Text>
              </View>
            </View>
          ))}

          <View style={modalStyles.clientInfo}>
            <Text style={{ color: "#2c3e50" }}>
              Tên khách hàng: {item.client.name}
            </Text>
          </View>

          <View style={modalStyles.employeeInfo}>
            <Text style={{ color: "#2c3e50" }}>Nhân viên phụ trách:</Text>
            {item.staffs.map((staff) => (
              <Text key={staff._id} style={{ color: "#2c3e50" }}>
                {staff.staffID.name} - {staff.staffID.job}
              </Text>
            ))}
          </View>

          <View style={modalStyles.addressInfo}>
            <Text style={{ color: "#2c3e50" }}>
              Địa chỉ thực hiện: {item.location}
            </Text>
          </View>

          <View style={modalStyles.timeInfo}>
            <Text style={{ color: "#2c3e50" }}>
              Thời gian hoàn thành: {item.deadline}
            </Text>
            <Text style={{ color: "#2c3e50" }}>
              Ngày tạo đơn: {formatDate(item.createdAt)}
            </Text>
          </View>

          <TouchableOpacity
            style={modalStyles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text>Đóng</Text>
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
    borderWidth: 1,
    borderColor: "#8a8a8a",
    borderRadius: 16,
  },
  status: {
    borderRadius: 16,
    paddingLeft: 16,
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
    fontWeight: "bold",
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

const modalStyles = StyleSheet.create({
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    borderColor: "#0E55A7",
    borderWidth: 2,
    margin: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0E55A7",
    marginBottom: 20,
  },
  serviceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  serviceImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  servicePrice: {
    color: "#2c3e50",
    marginBottom: 5,
  },
  serviceDescription: {
    color: "#7f8c8d",
    marginBottom: 10,
  },
  clientInfo: {
    marginBottom: 10,
  },
  employeeInfo: {
    marginBottom: 10,
  },
  addressInfo: {
    marginBottom: 10,
  },
  timeInfo: {
    marginBottom: 10,
  },
  dateInfo: {
    marginBottom: 10,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginTop: 10,
    color: "#3498db",
    fontWeight: "bold",
  },
});
