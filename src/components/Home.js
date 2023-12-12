import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppConText } from "../util/AppContext";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Client from "../components/Client";
import Bill from "../components/Bill";
import { vi } from "date-fns/locale";
import "intl";
import "intl/locale-data/jsonp/vi";
import { format } from "date-fns";
import { useNavigation } from "@react-navigation/native";
import FloatingButton from "../items/FloatingButton";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import { List } from "react-native-paper";
import AxiosIntance from "../util/AxiosIntance";
import ItemListJob from "./ItemListJob";

// * màu của từng trạng thái
const statusColors = {
  "Tất cả": "#0E55A7",
  "Chưa thực hiện": "red",
  "Đang thực hiện": "#b59700",
  "Hoàn thành": "green",
  "Đã hủy": "#b0b0b0",
};

const Home = () => {
  const navigation = useNavigation();
  const { inforUser } = useContext(AppConText);
  const [isModalVisible, setModalVisible] = useState(false);
  const [dataUser, setDataUser] = useState([]);
  const [dataListOrder, setDataListOrder] = useState([]);

  // * lọc trạng thái
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");
  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
  };
  // * lưu vị trí được chọn của trạng thái
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // * hiển thị modal staff
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // * chuyển đến trang ManagerStaff
  const handleNextStaff = () => {
    setModalVisible(false);
    navigation.navigate("ManagerStaff");
  };
  // * chuyển đến trang Salary
  const handleNextSalary = () => {
    setModalVisible(false);

    //navigation.navigate("ManagerStaff");
  };

  // TODO:  Xử lý api gọi danh sách đơn hàng
  const fetchDataOrder = async () => {
    try {
      const response = await AxiosIntance().get("/order/list");
      const apiData = response;
      setDataListOrder(apiData);
    } catch (error) {}
  };
  useEffect(() => {
    // const interval = setInterval(() => {
    //     fetchDataOrder();
    // }, 1000);;
    fetchDataOrder();

    // return ()=> clearInterval(interval);
  }, []);

  // TODO: Thiết lập ngôn ngữ mặc định cho ứng dụng thành tiếng Việt
  useEffect(() => {
    if (Platform.OS === "android") {
      require("intl/locale-data/jsonp/vi");
    }
  }, []);

  // * Lấy ngày hiện tại
  const today = new Date();
  const dayName = format(today, "EEEE", { locale: vi });
  const dayOfMonth = format(today, "d MMMM yyyy", { locale: vi });

  return (
    <SafeAreaProvider style={styles.container}>
      {/* phần header avatar, ngày tháng và background */}
      <View style={{ width: "100%" }}>
        <View style={styles.header}>
          <View style={styles.daymon_avatar}>
            <View style={{ width: "85%" }}>
              <Text style={styles.day}>{dayName}</Text>
              <Text style={styles.daymon}>Ngày {dayOfMonth}</Text>
            </View>
            <View>
              {inforUser.avatar ? (
                <Image
                  style={styles.avatar}
                  source={{ uri: inforUser.avatar }}
                />
              ) : (
                <Image
                  style={styles.avatar}
                  source={require("../icons/user.png")}
                />
              )}
            </View>
          </View>
          <Image
            style={styles.logoHome}
            source={require("../img/logoHome.png")}
          />
        </View>
      </View>

      {/* Phần thân */}
      <View style={styles.body}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollFill}
        >
          {Object.keys(statusColors).map((status, index) => (
            <TouchableOpacity
              key={status}
              onPress={() => {
                handleStatusFilter(status);
                setSelectedTabIndex(index);
              }}
              style={[
                styles.buttonScroll,
                {
                  backgroundColor:
                    selectedTabIndex === index ? statusColors[status] : "white",
                },
              ]}
            >
              <Text
                style={[
                  styles.textButton,
                  { color: selectedTabIndex === index ? "white" : "#0E55A7" },
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {dataListOrder.length > 0 ? (
        <FlatList
          style={styles.body_list}
          data={dataListOrder.filter(
            (item) =>
              selectedStatus === "Tất cả" || item.status === selectedStatus
          )}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ItemListJob item={item} />}
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
            Chưa có công việc nào
          </Text>
        </View>
      )}

      {/* khung button nhân viên và gói chụp */}
      <View style={styles.mid_header_body}>
        <TouchableOpacity style={styles.itemMid} onPress={toggleModal}>
          <Image
            style={styles.iconMid}
            source={require("../icons/card_staff.png")}
          />
          <Text style={styles.textMid}>Nhân viên</Text>
        </TouchableOpacity>
        <View
          style={{
            width: 2,
            height: 20,
            backgroundColor: "black",
            borderRadius: 20,
          }}
        ></View>
        <TouchableOpacity
          onPress={() => navigation.navigate("ManagerService")}
          style={styles.itemMid}
        >
          <Image
            style={styles.iconMid}
            source={require("../icons/camera.png")}
          />
          <Text style={styles.textMid}>Dịch vụ</Text>
        </TouchableOpacity>
      </View>

      {/* check role nếu là nhân viên thì ẩn menu quản lý*/}
      {inforUser.role === "Nhân viên" ? null : <FloatingButton />}

      {/* Modal hiển thị menu quản lý */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View>
            <TouchableOpacity style={styles.lineModal} onPress={toggleModal}>
              <View style={styles.line} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={inforUser.role !== "Nhân viên" ? handleNextStaff : null}
              style={[
                styles.fontItemModal,
                inforUser.role === "Nhân viên" && styles.disabledItem,
              ]}
            >
              <List.Item
                title="Nhân viên"
                description="Quản lý thông tin nhân viên"
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={({ size, color }) => (
                      <Image
                        source={require("../icons/card_staff.png")}
                        style={{ width: size, height: size, tintColor: color }}
                      />
                    )}
                    color="#062446"
                  />
                )}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.fontItemModal}>
              <List.Item
                title="Lương"
                description="Lương nhân viên"
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={({ size, color }) => (
                      <Image
                        source={require("../icons/salary.png")}
                        style={{ width: size, height: size, tintColor: color }}
                      />
                    )}
                    color="#062446"
                  />
                )}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaProvider>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  logoHome: {
    width: "100%",
    height: 150,
  },
  header: {
    height: 300,
    backgroundColor: "#e9e9e9",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "white",
  },
  daymon_avatar: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: 20,
  },
  day: {
    color: "#45576c",
    fontSize: 18,
  },
  daymon: {
    fontSize: 20,
    color: "#313e4d",
  },
  mid_header_body: {
    width: "85%",
    height: 50,
    backgroundColor: "#F8F8F8",
    position: "absolute",
    flexDirection: "row",
    top: 220,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  iconMid: {
    width: 28,
    height: 28,
  },
  itemMid: {
    flexDirection: "row",
    marginStart: 30,
  },
  textMid: {
    width: 100,
    height: 28,
    marginStart: 10,
    top: 4,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "35%",
  },
  line: {
    width: 50,
    height: 6,
    backgroundColor: "#062446",
    borderRadius: 2,
  },
  lineModal: {
    width: "100%",
    height: 5,
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  fontItemModal: {
    backgroundColor: "#e7eef6",
    borderRadius: 10,
    marginTop: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  disabledItem: {
    opacity: 0.5,
    pointerEvents: "none",
  },
  body: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 20,
    marginTop: -55,
  },
  body_list: {
    padding: 16,
    marginBottom: "21%",
  },
  textButton: {
    color: "white",
    fontWeight: "500",
  },
  scrollFill: {
    marginTop: 40,
    padding: 10,
    marginRight: 10,
  },
  buttonScroll: {
    borderRadius: 16,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderWidth: 2,
    borderColor: "#e7eef6",
  },
});
