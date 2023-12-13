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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";

const ItemListCart = (props) => {
  const { item, staffs } = props;
  const [expanded, setExpanded] = useState(false);
  const [clients, setClients] = useState([]);
  const [dataClient, setDataClient] = useState("");
  const { inforUser } = useContext(AppConText);

  // * 2 trường địa chỉ và ghi chú
  const [locationValue, setLocationValue] = useState("");
  const [noteValue, setNoteValue] = useState("");

  // * lưu giá trị của nhân danh sách nhân viên khi mở modal
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  // * lưu thời gian bắt đầu
  const [startTime, setStartTime] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // * lưu thời gian hoàn thành
  const [endTime, setEndTime] = useState("");
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

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
      const clientData = response;
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

  // TODO: Xử lý xác nhận hóa đơn
  const handleConfirmOder = async () => {
    try {
      const orderData = {
        serviceID: item.serviceID._id,
        client: dataClient,
        started: startTime,
        deadline: endTime,
        location: locationValue,
        note: noteValue,
      }
      await AxiosIntance().post(`/order/confirmOrder/${inforUser._id}`, orderData);
      Toast.show({
        type: "success",
        text1: "Xác nhận đơn hàng thành công"
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Xác nhận đơn hàng thất bại"
      });
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

  // TODO: xử lý hiển thị và format date thời gian bắt đầu
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleDateConfirm = (date) => {
    const fommattedDate_Time = format(date, "HH:mm dd/MM/yyyy");
    setStartTime(fommattedDate_Time);
    hideDatePicker();
  };

  // TODO: xử lý hiển thị và format date thời gian hoàn thành
  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };
  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };
  const handleEndDateConfirm = (date) => {
    const formattedEndDate = format(date, "dd/MM/yyyy");
    setEndTime(formattedEndDate);
    hideEndDatePicker();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleExpansion}>
        <Image style={styles.image} source={{ uri: item.serviceID.image }} />
        <View style={styles.infoService}>
          <Text style={styles.textName}>{item.serviceID.name}</Text>
          <Text style={styles.textPrice}>
            {formatCurrency(item.serviceID.price)}
          </Text>
          <Text>Ngày tạo: {formattedCreated}</Text>
        </View>
      </TouchableOpacity>
      {expanded && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.tilte}>Khách hàng</Text>
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

          <View>
            <Text style={styles.tilte}>Nhân viên phụ trách</Text>
            <TouchableOpacity
              style={{
                marginTop: 10,
                borderWidth: 1,
                width: 30,
                alignItems: "center",
                marginBottom: 5,
              }}
              onPress={toggleEmployeeModal}
            >
              <MaterialIcons name="add" size={20} />
            </TouchableOpacity>
          </View>

          {staffs.map((staff) => (
            <Text key={staff._id}>
              {staff.staffID
                ? `${staff.staffID.name} - ${staff.staffID.job}`
                : "No staff information"}
            </Text>
          ))}

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
            <Text style={styles.tilte}>Thời gian bắt đầu</Text>
            <View style={{ flexDirection: "row" }}>
              <EvilIcons name="calendar" size={40} onPress={showDatePicker} />
              <TextInput
                placeholder="00:00 dd/MM/yyyy"
                style={[styles.textinput, { width: "88%" }]}
                value={startTime}
                editable={false}
                mode="outlined"
                outlineColor="#0E55A7"
              />
            </View>
          </View>

          {/* Lịch chọn giờ và ngày bắt đầu*/}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleDateConfirm}
            onCancel={hideDatePicker}
          />

          {/* Lịch chọn ngày hoàn thành */}
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
          />

          <View style={{ marginTop: 10 }}>
            <Text style={styles.tilte}>Thời gian hoàn thành</Text>
            <View style={{ flexDirection: "row" }}>
              <EvilIcons
                name="calendar"
                size={40}
                onPress={showEndDatePicker}
              />
              <TextInput
                placeholder="dd/MM/yyyy"
                style={[styles.textinput, { width: "88%" }]}
                editable={false}
                value={endTime}
                mode="outlined"
                outlineColor="#0E55A7"
              />
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.tilte}>Địa chỉ</Text>
            <TextInput
              mode="outlined"
              placeholder="Nhập địa chỉ thực hiện"
              style={styles.textinput}
              outlineColor="#0E55A7"
              activeOutlineColor="#0E55A7"
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.tilte}>Ghi chú</Text>
            <TextInput
              placeholder="Ghi chú..."
              style={[styles.textinput, { height: 100 }]}
              mode="outlined"
              multiline={true}
              outlineColor="#0E55A7"
              activeOutlineColor="#0E55A7"
            />
          </View>

          <TouchableOpacity style={styles.buttonConfirm} onPress={handleConfirmOder}>
            <Text style={{ color: "white", fontWeight: "500" }}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ItemListCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0E55A7",
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
    color: "#062446",
  },
  textPrice: {
    color: "#545454",
  },
  dropdown: {
    height: 40,
    borderColor: "#0E55A7",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
  },
  textinput: {
    height: 40,
    borderRadius: 5,
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
  tilte: {
    color: "#062446",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 2,
  },
});
