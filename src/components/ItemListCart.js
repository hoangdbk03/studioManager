import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { format, parseISO } from "date-fns";
import { TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { useEffect } from "react";
import AxiosIntance from "../util/AxiosIntance";
import Modal from "react-native-modal";
// import {CheckBox} from "react-native-paper";
import { styleModal } from "../style/styleModal";
import { Checkbox } from "react-native-paper";
import { AppConText } from "../util/AppContext";

const ItemListCart = (props) => {
  const { item } = props;
  const [expanded, setExpanded] = useState(false);
  const [clients, setClients] = useState([]);
  const [dataClient, setDataClient] = useState("");
  const { inforUser } = useContext(AppConText);

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  // * hiển thị modal
  const toggleEmployeeModal = () => {
    setShowEmployeeModal(!showEmployeeModal);
  };

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

  // TODO: xử lý thêm nhân viên vào giỏ hàng
  const addStaffToCart = async (serviceId, staffId) => {
    try {
      // Gọi API để thêm nhân viên vào giỏ hàng
      await AxiosIntance().post(`/cart/addStaffToCart/${inforUser._id}`, {
        serviceID: serviceId,
        staffID: staffId,
      });
      console.log("Thêm nv vào cart thành công");
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên vào giỏ hàng:", error);
      Alert.alert("Đã xảy ra lỗi khi thêm nhân viên vào giỏ hàng!");
    }
  };
  // TODO: xử lý xóa nhân viên khỏi giỏ hàng
  const removeStaffFromCart = async (serviceId, staffId) => {
    try {
      // Gọi API để loại bỏ nhân viên khỏi giỏ hàng
      const response = await AxiosIntance().delete(
        `/cart/removeStaffFromCart/${inforUser._id}`,
        {
          data: {
            serviceID: serviceId,
            staffID: staffId,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Xóa nv khỏi cart thành công");
    } catch (error) {
      Alert.alert(
        "Thông báo",
        "Đã xảy ra lỗi khi loại bỏ nhân viên khỏi giỏ hàng"
      );
    }
  };

  // TODO: xử lý chọn checkbox
  const handleEmployeeCheckbox = (employeeId) => {
    if (selectedEmployees.includes(employeeId)) {
      // Nếu đã chọn rồi thì loại bỏ khỏi danh sách và giỏ hàng
      removeStaffFromCart(item.serviceID._id, employeeId);
      setSelectedEmployees((prevSelected) =>
        prevSelected.filter((id) => id !== employeeId)
      );
    } else {
      // Nếu chưa chọn thì thêm vào danh sách và giỏ hàng
      addStaffToCart(item.serviceID._id, employeeId);
      setSelectedEmployees((prevSelected) => [...prevSelected, employeeId]);
    }
  };

  // TODO: xử lý api lấy danh sách người dùng
  const fetchEmployees = async () => {
    try {
      const response = await AxiosIntance().get("/user/list");
      const employeeData = response;
      setEmployees(employeeData);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách nhân viên:", error);
    }
  };
  useEffect(() => {
    fetchEmployees();
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
            placeholder="Chọn khách hàng"
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
          <TouchableOpacity
            style={{ marginTop: 10 }}
            onPress={toggleEmployeeModal}
          >
            <Text>Nhân viên phụ trách</Text>
          </TouchableOpacity>

          {/* Modal hiển thị danh sách chọn nhân viên */}
          <Modal
            isVisible={showEmployeeModal}
            onBackdropPress={toggleEmployeeModal}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              {employees.map(
                (employee) =>
                  employee.role === "Nhân viên" && (
                    <View key={employee._id} style={styles.employeeItem}>
                      <Checkbox
                        status={
                          selectedEmployees.includes(employee._id)
                            ? "checked"
                            : "unchecked"
                        }
                        onPress={() => handleEmployeeCheckbox(employee._id)}
                      />
                      <Text>{`${employee.name} - ${employee.job}`}</Text>
                    </View>
                  )
              )}
              <TouchableOpacity
                style={styles.buttonConfirm}
                onPress={() => {
                  toggleEmployeeModal();
                }}
              >
                <Text style={{ color: "white", fontWeight: "500" }}>
                  Xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>

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
  employeeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  modalContainer: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "flex-start",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
});
