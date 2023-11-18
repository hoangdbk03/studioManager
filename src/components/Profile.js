import {
  Image,
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

const Profile = () => {
  const navigation = useNavigation();
  const [islogoutVisible, setlogoutVisible] = useState(false);
  const [isChangePasswordVisible, setChangePasswordVisible] = useState(false);
  const [isStayLoggedInModalVisible, setStayLoggedInModalVisible] =
    useState(false);

  //lấy dữ liệu được lưu từ AppConText
  const { inforUser } = useContext(AppConText);
  const { setisLogin } = useContext(AppConText);

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

  const handleStayLoggedInChoice = (stayLoggedIn) => {
    setStayLoggedInModalVisible(false);
    if (!stayLoggedIn) {
      // Logout the user if they choose not to stay logged in
      logout();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.role}>Tài khoản: {inforUser.role}</Text>
      <View style={styles.container1}>
        {/* phần thông tin người dùng */}
        <View style={styles.profile}>
          <View style={styles.frameAvt}>
            <Image
              source={{ uri: inforUser.avatar }}
              style={{ height: 60, width: 60, borderRadius: 100 }}
            />
          </View>
          <View style={styles.infor}>
            <Text style={styles.textName}>{inforUser.name}</Text>
            <Text style={styles.textEmail}>{inforUser.email}</Text>
          </View>
          <TouchableOpacity style={{ flex: 1, alignItems: "flex-end" }}>
            <MaterialIcons
              name="edit"
              size={25}
              color={"white"}
              style={{ marginEnd: 20 }}
            />
          </TouchableOpacity>
        </View>

        {/* phần các chức năng thông tin*/}
        <View style={styles.body1}>
          <TouchableOpacity
            style={styles.frame1}
            onPress={toggleModalChangePass}
          >
            <View style={styles.frameIcon}>
              <Image
                source={require("../icons/password.png")}
                style={styles.icon}
              />
            </View>
            <View style={{ marginStart: 10 }}>
              <Text style={styles.titleButton}>Đổi mật khẩu</Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <MaterialIcons
                name="navigate-next"
                size={20}
                color={"gray"}
                style={{ marginEnd: 10 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.frame1}>
            <View style={styles.frameIcon}>
              <Image
                source={require("../icons/support.png")}
                style={styles.icon}
              />
            </View>
            <View style={{ marginStart: 10 }}>
              <Text style={styles.titleButton}>Hỗ trợ</Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <MaterialIcons
                name="navigate-next"
                size={20}
                color={"gray"}
                style={{ marginEnd: 10 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.frame1}>
            <View style={styles.frameIcon}>
              <Image
                source={require("../icons/info.png")}
                style={styles.icon}
              />
            </View>
            <View style={{ marginStart: 10 }}>
              <Text style={styles.titleButton}>Thông tin ứng dụng</Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <MaterialIcons
                name="navigate-next"
                size={20}
                color={"gray"}
                style={{ marginEnd: 10 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleModalLogout} style={styles.frame1}>
            <View style={styles.frameIcon}>
              <Image
                source={require("../icons/logout.png")}
                style={styles.icon}
              />
            </View>
            <View style={{ marginStart: 10 }}>
              <Text style={styles.titleButton}>Đăng xuất</Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <MaterialIcons
                name="navigate-next"
                size={20}
                color={"gray"}
                style={{ marginEnd: 10 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
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
              <Text style={{color: '#0E55A7'}}>Đồng ý</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
            {/* <TextInput
              mode="outlined"
              label="Nhập lại mật khẩu mới"
              
              style={styles.textInput}
            /> */}
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
      <Modal isVisible={isStayLoggedInModalVisible}>
        <View style={styles.containerModal}>
          <Text style={styles.textModal}>Bạn có muốn duy trì đăng nhập?</Text>
          <View style={styleModal.buttonModal}>
            <TouchableOpacity
              onPress={() => handleStayLoggedInChoice(true)}
              style={styleModal.button1}
            >
              <Text style={{color: '#0E55A7'}}>Có</Text>
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
    marginTop: 10,
  },
  container1: {
    flex: 1,
    alignItems: "center",
  },
  body: {
    width: "95%",
    height: "30%",
    marginTop: 25,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
  },
  body1: {
    width: "95%",
    height: "45%",
    marginTop: 25,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
  },
  role: {
    marginStart: 20,
    fontSize: 20,
    fontWeight: "bold",
    color: '#313e4d'
  },
  profile: {
    marginTop: 10,
    flexDirection: "row",
    width: "95%",
    height: "12%",
    backgroundColor: "#0E55A7",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  infor: {
    marginStart: 10,
  },
  frameAvt: {
    width: 62,
    height: 62,
    backgroundColor: "white",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginStart: 20,
  },
  textName: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
  textEmail: {
    color: "white",
    fontSize: 12,
    fontWeight: "300",
    marginTop: 5,
  },
  frame: {
    width: "95%",
    height: "28%",
    flexDirection: "row",
    marginTop: 10,
    marginStart: 20,
    alignItems: "center",
  },
  frame1: {
    width: "95%",
    height: "18%",
    flexDirection: "row",
    marginTop: 10,
    marginStart: 20,
    alignItems: "center",
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
    backgroundColor: '#f7fbff',
  },
  titleButton: { 
    fontSize: 16, 
    color: "#313e4d" 
  },
});
