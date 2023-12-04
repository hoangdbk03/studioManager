import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { AppConText } from "../util/AppContext";
import AxiosIntance from "../util/AxiosIntance";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Modal from "react-native-modal";
import { TextInput } from "react-native-paper";
import { styleModal } from "../style/styleModal";
import { useEffect } from "react";

const Profile = ({ route }) => {
  const navigation = useNavigation();
  const [islogoutVisible, setlogoutVisible] = useState(false);
  const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);
  const [isStayLoggedInModalVisible, setStayLoggedInModalVisible] =
    useState(false);

  // * lấy dữ liệu được lưu từ AppConText
  const { inforUser } = useContext(AppConText);
  const { setisLogin } = useContext(AppConText);

  // * lưu dữ liệu người dùng
  const [data, setData] = useState({});

  const [idsession, setidsession] = useState(inforUser.session_id);
  const [dataUser, setdataUser] = useState({
    oldpassword: "",
    password: "",
  });

  //xử lý hiển thị modal
  const toggleModalLogout = () => {
    setlogoutVisible(!islogoutVisible);
  };
  const toggleModalChangePass = () => {
    setChangePasswordVisible(!isChangePasswordVisible);
  };
  const showStayLoggedInModal = () => {
    setStayLoggedInModalVisible(true);
  };

  //gọi api xử lý đăng xuất
  const logout = async () => {
    try {
      const response = await AxiosIntance().get("/user/logout/" + idsession);
      if (response) {
        setisLogin(false);
        Toast.show({
          type: "success",
          text1: "ĐĂNG XUẤT THÀNH CÔNG",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "ĐĂNG XUẤT THẤT BẠI",
      });
    }
  };

  //gọi api xử lý đổi mk
  const HandleChangePass = async () => {
    if (dataUser.oldpassword.trim() === "" || dataUser.password.trim() === "") {
      toggleModalChangePass();
      Toast.show({
        type: "info",
        text1: "Vui lòng nhập đầy đủ thông tin!",
      });
    } else {
      try {
        await AxiosIntance().put(
          `/user/change-password/${inforUser._id}`,
          dataUser
        );
        toggleModalChangePass();
        showStayLoggedInModal();
        Toast.show({
          type: "success",
          text1: "Đổi mật khẩu thành công",
        });
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Đổi mật khẩu không thành công",
        });
      }
    }
  };

  // xử lý logout
  const handleStayLoggedInChoice = (stayLoggedIn) => {
    setStayLoggedInModalVisible(false);
    if (!stayLoggedIn) {
      // Logout the user if they choose not to stay logged in
      logout();
    }
  };

  // gọi api chi tiết người dùng
  const fetchData = async () => {
    try {
      const response = await AxiosIntance().get(
        `/user/detail/${inforUser._id}`
      );
      setData(response);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (route.params?.refresh) {
      fetchData();
      navigation.setParams({ refresh: false });
    } else {
      fetchData();
    }
  }, [route.params?.refresh]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../img/backgroundProfile.jpg")}
        style={styles.background}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("DetailUser")}
        style={{ position: "absolute", right: 30, marginTop: 10 }}
      >
        {data.role === "Admin" ? null : (
          <MaterialIcons name="edit" size={25} color={"white"} />
        )}
      </TouchableOpacity>
      <View style={styles.profile}>
        {/* thông tin tên email */}
        <View style={styles.infor}>
          <Text style={styles.textName}>{data.name}</Text>
          <Text style={styles.textEmail}>{data.email}</Text>
        </View>

        {/* các nút xử lý */}
        <ScrollView>
          <View>
            <TouchableOpacity
              style={[styles.frameContainer, { marginTop: 50 }]}
            >
              <View style={styles.frameButton}>
                <Image
                  style={styles.icon}
                  source={require("../icons/password.png")}
                />
                <Text style={styles.textButton}>Đổi mật khẩu</Text>
              </View>
              <MaterialIcons
                name="navigate-next"
                size={20}
                color={"gray"}
                style={{ marginEnd: 10 }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.frameContainer}>
              <View style={styles.frameButton}>
                <Image
                  style={styles.icon}
                  source={require("../icons/support.png")}
                />
                <Text style={styles.textButton}>Trợ giúp</Text>
              </View>
              <MaterialIcons
                name="navigate-next"
                size={20}
                color={"gray"}
                style={{ marginEnd: 10 }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.frameContainer}>
              <View style={styles.frameButton}>
                <Image
                  style={styles.icon}
                  source={require("../icons/info.png")}
                />
                <Text style={styles.textButton}>Thông tin ứng dụng</Text>
              </View>
              <MaterialIcons
                name="navigate-next"
                size={20}
                color={"gray"}
                style={{ marginEnd: 10 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.frameContainer, { marginBottom: 10 }]}
              onPress={toggleModalLogout}
            >
              <View style={styles.frameButton}>
                <Image
                  style={styles.icon}
                  source={require("../icons/logout.png")}
                />
                <Text style={styles.textButton}>Đăng xuất</Text>
              </View>
              <MaterialIcons
                name="navigate-next"
                size={20}
                color={"gray"}
                style={{ marginEnd: 10 }}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <View style={styles.frameAvt}>
        {data.avatar ? (
          <Image
            source={{ uri: data.avatar }}
            style={{
              height: 95,
              width: 95,
              borderRadius: 15,
              backgroundColor: "black",
            }}
          />
        ) : (
          <Image
            source={require("../icons/user.png")}
            style={{
              height: 95,
              width: 95,
              borderRadius: 15,
              backgroundColor: "black",
            }}
          />
        )}
      </View>

      {/* Modal xác nhận đăng xuất */}
      <Modal isVisible={islogoutVisible}>
        <View style={styles.containerModal}>
          <Text style={styles.textModal}>Bạn chắc chắn muốn đăng xuất?</Text>
          <View style={styleModal.buttonModal}>
            <TouchableOpacity
              onPress={toggleModalLogout}
              style={styleModal.button1}
            >
              <Text>Không</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={logout} style={styleModal.button2}>
              <Text style={{ color: "#0E55A7" }}>Đồng ý</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal đổi mật khẩu */}
      <Modal isVisible={isChangePasswordVisible}>
        <View style={styleModal.modalContainer}>
          <View style={styleModal.modalContent}>
            <View style={styleModal.frameTitleModal}>
              <Text style={styleModal.titleModal}>Đổi mật khẩu</Text>
            </View>
            <TextInput
              mode="outlined"
              label="Mật khẩu cũ"
              onChangeText={(text) =>
                setdataUser({ ...dataUser, oldpassword: text })
              }
              style={styles.textInput}
            />
            <TextInput
              mode="outlined"
              label="Mật khẩu mới"
              onChangeText={(text) =>
                setdataUser({ ...dataUser, password: text })
              }
              style={styles.textInput}
            />
            <TextInput
              mode="outlined"
              label="Nhập lại mật khẩu mới"
              style={styles.textInput}
            />
            <View style={styleModal.buttonModal}>
              <TouchableOpacity
                onPress={toggleModalChangePass}
                style={styleModal.button1}
              >
                <Text style={styleModal.textButton1}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styleModal.button2}
                onPress={HandleChangePass}
              >
                <Text style={styleModal.textButton2}>Cập nhật</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal hỏi khi đổi mật khẩu */}
      <Modal isVisible={isStayLoggedInModalVisible}>
        <View style={styles.containerModal}>
          <Text style={styles.textModal}>Bạn có muốn duy trì đăng nhập?</Text>
          <View style={styleModal.buttonModal}>
            <TouchableOpacity
              onPress={() => handleStayLoggedInChoice(true)}
              style={styleModal.button1}
            >
              <Text style={{ color: "#0E55A7" }}>Có</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleStayLoggedInChoice(false)}
              style={styleModal.button2}
            >
              <Text>Không</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E55A7",
    marginBottom: "22%",
  },
  background: {
    width: "100%",
    height: 155,
  },
  container1: {
    flex: 1,
    alignItems: "center",
  },
  profile: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    alignItems: "center",
  },
  infor: {
    marginTop: 70,
    alignItems: "center",
  },
  frameAvt: {
    width: 110,
    height: 110,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    marginTop: 100,
    backgroundColor: "white",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  frameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    width: 350,
    borderRadius: 10,
    padding: 20,
    marginTop: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  frameButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  textButton: {
    fontSize: 16,
    fontWeight: "bold",
    marginStart: 20,
    color: "#3e77b9",
  },
  textName: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
  },
  textEmail: {
    color: "#8a8a8a",
    fontSize: 15,
    fontWeight: "400",
    marginTop: 5,
  },
  frameIcon: {
    backgroundColor: "#f7f7f7",
    width: 50,
    height: 50,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#0E55A7",
  },
  containerModal: {
    backgroundColor: "white",
    borderRadius: 5,
  },
  textModal: {
    padding: 20,
  },
  textInput: {
    width: "90%",
    marginTop: 10,
    backgroundColor: "#f7fbff",
  },
});
