import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { format, parseISO } from "date-fns";
import { TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { useEffect } from "react";
import AxiosIntance from "../util/AxiosIntance";
import Modal from "react-native-modal";
import { CheckBox } from "react-native-paper";
import { styleModal } from "../style/styleModal";

const ItemListCart = (props) => {
  const { item } = props;
  const [expanded, setExpanded] = useState(false);
  const [clients, setClients] = useState([]);
  const [dataClient, setDataClient] = useState("");

  const [employees, setEmployees] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  // *

  // * hiển thị modal
  const toggleEmployeeModal = () => {
    setShowEmployeeModal(!showEmployeeModal);
  };

  // TODO: Add API call to fetch list of employees
  // const fetchEmployees = async () => {
  //   try {
  //     const response = await AxiosIntance().get("/user/list");
  //     const employeeData = response; // Update if API response structure is different
  //     setEmployees(employeeData);
  //   } catch (error) {
  //     console.error("Error fetching employees:", error);
  //   }
  // };
  // useEffect(() => {
  //   fetchEmployees();
  // });

  // * định dạng lại tiền việt
  const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    return formatter.format(amount);
  };

  //* chỉnh lại ngày tạo
  const createdDate = item ? item.createdAt : null;
  const dateTimeCreated = createdDate ? parseISO(createdDate) : null;
  const formattedCreated = dateTimeCreated
    ? format(dateTimeCreated, "dd/MM/yyyy HH:mm:ss")
    : null;

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  // TODO: xử lý api lấy danh sách khách hàng
  const fetchClients = async () => {
    try {
      const response = await AxiosIntance().get("/client/list");
      const clientData = response; // Chỉnh sửa nếu API trả về dữ liệu khác
      setClients(clientData);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <TouchableOpacity style={styles.container} onPress={toggleExpansion}>
      <View style={styles.header}>
        <Image style={styles.image} source={{ uri: item.serviceID.image }} />
        <View style={styles.infoService}>
          <Text style={styles.textName}>{item.serviceID.name}</Text>
          <Text style={styles.textPrice}>
            {formatCurrency(item.serviceID.price)}
          </Text>
          <Text>Ngày tạo: {formattedCreated}</Text>
        </View>
      </View>
      {expanded && (
        <View style={{ marginTop: 10 }}>
          <Text>Khách hàng</Text>
          <Dropdown
            search
            inputSearchStyle={styles.inputSearchStyle}
            searchPlaceholder="Tìm kiếm..."
            labelField="label"
            valueField="value"
            placeholder="Khách hàng"
            containerStyle={{ borderRadius: 10 }}
            style={styles.dropdown}
            value={dataClient}
            data={clients.map((client) => ({
              label: `${client.name} - ${client.phone}`,
              value: `${client._id}`,
            }))}
            onChange={(item) => {
              setDataClient(item.value);
            }}
            onChangeText={(value) => setDataClient(value)}
          />
          <TouchableOpacity style={{ marginTop: 10 }}>
            <Text>Nhân viên phụ trách</Text>
          </TouchableOpacity>

          {/* dữ liệu giả */}
          <View>
            <Text>Nguyễn Duy Đạt - Photographer</Text>
            {/* Các dữ liệu giả khác */}
            <Text>Lê Thị Hoa - Meakup</Text>
            <Text>Hồ Hậu - Hậu kì</Text>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text>Thời gian bắt đầu</Text>
            <TextInput
              placeholder="Nhập thời gian bắt đầu"
              style={styles.dropdown}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Text>Thời gian hoàn thành</Text>
            <TextInput
              placeholder="Nhập thời gian hoàn thành"
              style={styles.dropdown}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Text>Địa chỉ</Text>
            <TextInput placeholder="Nhập địa chỉ" style={styles.dropdown} />
          </View>

          <View style={{ marginTop: 10 }}>
            <Text>Ghi chú</Text>
            <TextInput
              placeholder="Ghi chú..."
              style={[styles.dropdown, { height: 100 }]}
              multiline={true}
            />
          </View>

          <TouchableOpacity style={styles.buttonConfirm}>
            <Text style={{ color: "white", fontWeight: "500" }}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal isVisible={showEmployeeModal}>
        <View style={styleModal.modalContainer}></View>
        <Text onPress={toggleEmployeeModal}>Đóng</Text>
      </Modal>
    </TouchableOpacity>
  );
};

export default ItemListCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e7eef6",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  header: {
    flexDirection: "row",
  },
  buttonConfirm: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0E55A7",
    borderRadius: 10,
    marginTop: 10,
  },
  infoService: {
    marginStart: 5,
    justifyContent: "center",
  },
  textName: {
    fontSize: 16,
    fontWeight: "500",
    height: 25,
  },
  textPrice: {
    marginTop: 2,
    color: "#545454",
  },
  dropdown: {
    height: 40,
    borderColor: "#b4cae4",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
