import {
  Image,
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
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";


const Profile = () => {
  const navigation = useNavigation();

  //lấy dữ liệu được lưu từ AppConText
  const { inforUser } = useContext(AppConText);
  const { setisLogin } = useContext(AppConText);

  const [idsession, setidsession] = useState(inforUser.session_id);

  const logout = async () => {
    try {
      const response = await AxiosIntance().get("/user/logout/" + idsession);
      if (response) {
        setisLogin(false);
        ToastAndroid.show("Đăng xuất thành công", ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show("Đăng xuất thất bại", ToastAndroid.SHORT);
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

        {/* phần các chức năng quản lý*/}
        <View style={styles.body}>
          <TouchableOpacity style={styles.frame} onPress={() =>{navigation.navigate("ManagerClient")}}>
            <View style={styles.frameIcon}>
              <Image
                source={require("../icons/list.png")}
                style={styles.icon}
              />
            </View>
            <View style={{ marginStart: 10 }}>
              <Text style={{ fontSize: 16 }}>Quản lý khách hàng</Text>
              <Text style={{ fontSize: 10, color: "gray" }}>
                Thêm sửa xóa thông tin khách hàng
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <MaterialIcons
                name="navigate-next"
                size={30}
                color={"gray"}
                style={{ marginEnd: 10 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.frame} onPress={() =>{navigation.navigate("ManagerBill")}}>
            <View style={styles.frameIcon}>
              <Image
                source={require("../icons/bill.png")}
                style={styles.icon}
              />
            </View>
            <View style={{ marginStart: 10 }}>
              <Text style={{ fontSize: 16 }}>Quản lý hóa đơn</Text>
              <Text style={{ fontSize: 10, color: "gray" }}>
                Thêm sửa xóa hóa đơn mới
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <MaterialIcons
                name="navigate-next"
                size={30}
                color={"gray"}
                style={{ marginEnd: 10 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.frame}>
            <View style={styles.frameIcon}>
              <Image
                source={require("../icons/password.png")}
                style={styles.icon}
              />
            </View>
            <View style={{ marginStart: 10 }}>
              <Text style={{ fontSize: 16 }}>Đổi mật khẩu</Text>
              <Text style={{ fontSize: 10, color: "gray" }}>
                Thay đổi mật khẩu mới
              </Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <MaterialIcons
                name="navigate-next"
                size={30}
                color={"gray"}
                style={{ marginEnd: 10 }}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* phần các chức năng thông tin*/}
        <View style={styles.body1}>
          <TouchableOpacity style={styles.frame1} onPress={() =>{navigation.navigate("Register")}}>
            <View style={styles.frameIcon}>
              <Image
                source={require("../icons/add-user.png")}
                style={styles.icon}
              />
            </View>
            <View style={{ marginStart: 10 }}>
              <Text style={{ fontSize: 16 }}>Đăng ký tài khoản người dùng</Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <MaterialIcons
                name="navigate-next"
                size={30}
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
              <Text style={{ fontSize: 16 }}>Hỗ trợ</Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <MaterialIcons
                name="navigate-next"
                size={30}
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
              <Text style={{ fontSize: 16 }}>Thông tin ứng dụng</Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <MaterialIcons
                name="navigate-next"
                size={30}
                color={"gray"}
                style={{ marginEnd: 10 }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={styles.frame1}>
            <View style={styles.frameIcon}>
              <Image
                source={require("../icons/logout.png")}
                style={styles.icon}
              />
            </View>
            <View style={{ marginStart: 10 }}>
              <Text style={{ fontSize: 16 }}>Đăng xuất</Text>
            </View>
            <View style={{ flex: 1, alignItems: "flex-end" }}>
              <MaterialIcons
                name="navigate-next"
                size={30}
                color={"gray"}
                style={{ marginEnd: 10 }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
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
    borderRadius: 10
  },
  body1: {
    width: "95%",
    height: "45%",
    marginTop: 25,
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10
  },
  role: {
    marginStart: 20,
    fontSize: 20,
    fontWeight: "bold",
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
});
