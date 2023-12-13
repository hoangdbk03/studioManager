import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { Checkbox } from "react-native-paper";
import AxiosIntance from "../util/AxiosIntance";
import { AppConText } from "../util/AppContext";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const { setisLogin, setinforUser } = useContext(AppConText);
  const navigation = useNavigation();

  const [emailUser, setemailUser] = useState("");
  const [passwordUser, setpasswordUser] = useState("");
  const [loading, setLoading] = useState(false);

  // * ẩn hoặc hiển thị password
  const [isPasswordVisible, setisPasswordVisible] = useState(false);

  const [translateY] = useState(new Animated.Value(500));

  const togglePasswordVisibility = () => {
    setisPasswordVisible(!isPasswordVisible);
  };

  // * ghi nhớ tài khoản
  const [rememberCredentials, setRememberCredentials] = useState(false);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("emailUser");
        const storedPassword = await AsyncStorage.getItem("passwordUser");
        const storedRemember = await AsyncStorage.getItem("rememberCredentials");

        if (storedRemember && storedEmail && storedPassword) {
          setemailUser(storedEmail);
          setpasswordUser(storedPassword);
          setRememberCredentials(true);

          Animated.timing(translateY, {
            toValue: 0,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: false,
          }).start();
        }
      } catch (error) {
        console.error("Lỗi tải thông tin đăng nhập", error);
      }
    };

    loadCredentials();
  }, [translateY]);

  const goLogin = async () => {
    if (!emailUser || !passwordUser) {
      Toast.show({
        type: "info",
        text1: "VUI LÒNG NHẬP ĐẦY ĐỦ THÔNG TIN.",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await AxiosIntance().post("/user/login", {
        email: emailUser,
        password: passwordUser,
      });

      if (response.loggedin) {
        Toast.show({
          type: "success",
          text1: "ĐĂNG NHẬP THÀNH CÔNG",
        });
        setisLogin(true);
        setinforUser(response);

        // lưu thông tin đăng nhập nếu được chọn 
        if (rememberCredentials) {
          await AsyncStorage.setItem("emailUser", emailUser);
          await AsyncStorage.setItem("passwordUser", passwordUser);
          await AsyncStorage.setItem("rememberCredentials", "true");
        } else {
          // Xóa thông tin đăng nhập nếu bỏ chọn
          await AsyncStorage.removeItem("emailUser");
          await AsyncStorage.removeItem("passwordUser");
          await AsyncStorage.removeItem("rememberCredentials");
        }
      } else {
        Toast.show({
          type: "error",
          text1: "SAI MẬT KHẨU!",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "EMAIL KHÔNG TỒN TẠI!",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, []);

  return (
    //hình logo
    <ScrollView style={styles.container}>
      <Image style={styles.img} source={require("../img/backgroundSpl.jpg")} />
      <Image style={styles.imgFont} source={require("../img/fontBack.png")} />

      {/* form đăng nhập */}
      <Animated.View style={{ transform: [{ translateY }] }}>
        <View style={styles.fontLogin}>
          <Text style={styles.loginText}>Đăng nhập</Text>
          <View style={styles.bar} />

          {/* EMAIL */}
          <View>
            <View style={styles.inputEmail}>
              <TextInput
                style={styles.textInput}
                placeholder="example@gmail.com"
                onChangeText={setemailUser}
                value={emailUser}
              />
            </View>
            <View style={styles.viewLabelEmail}>
              <Text Text style={styles.label}>
                Email
              </Text>
            </View>
          </View>

          {/* Password */}
          <View>
            <View style={styles.inputPass}>
              <TextInput
                style={styles.textInput}
                label="Mật khẩu"
                secureTextEntry={!isPasswordVisible}
                placeholder="*************"
                onChangeText={setpasswordUser}
                value={passwordUser}
              />
              <TouchableOpacity
                style={styles.passwordVisibilityIcon}
                onPress={togglePasswordVisibility}
              >
                <Icon
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#0E55A7"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.viewLabelPass}>
              <Text Text style={styles.label}>
                Mật khẩu
              </Text>
            </View>
          </View>

          {/* checkbox và quên mật khẩu */}
          <View style={styles.checkBox}>
            <View style={styles.checkBox}>
              <Checkbox
                status={rememberCredentials  ? "checked" : "unchecked"}
                onPress={() => {
                  setRememberCredentials(!rememberCredentials);
                }}
                color="#0E55A7"
                uncheckedColor="#0E55A7"
              />
              <Text style={{ color: "#0E55A7", top: 8 }}>Ghi nhớ tài khoản</Text>
            </View>
            <Text
              style={{
                marginLeft: 70,
                top: 12,
                color: "#0E55A7",
                textDecorationLine: "underline",
              }}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              Quên mật khẩu?
            </Text>
          </View>

          {/* Button đăng nhập */}
          <TouchableOpacity style={styles.buttonLogin} onPress={goLogin}>
            <Text style={styles.textButton}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0E55A7" />
        </View>
      )}
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  img: {
    width: "100%",
    height: 225,
    marginTop: 30,
  },
  imgFont: {
    width: "100%",
    position: "absolute",
    marginTop: 250,
  },
  fontLogin: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 50,
    alignItems: "center",
    height: "100%",
  },
  loginText: {
    color: "#0E55A7",
    fontWeight: "400",
    fontSize: 26,
    marginTop: 30,
  },
  bar: {
    width: 110,
    height: 3,
    backgroundColor: "#0E55A7",
    marginTop: 5,
    borderRadius: 20,
  },
  inputEmail: {
    width: 320,
    height: 50,
    borderWidth: 3,
    borderRadius: 12,
    borderColor: "#0E55A7",
    marginTop: 40,
  },
  inputPass: {
    width: 320,
    height: 50,
    borderWidth: 3,
    borderRadius: 12,
    borderColor: "#0E55A7",
    marginTop: 30,
  },
  textInput: {
    marginStart: 28,
    marginTop: 10,
  },
  viewLabelEmail: {
    width: 50,
    backgroundColor: "white",
    position: "absolute",
    marginStart: 25,
    top: 30,
  },
  viewLabelPass: {
    width: 80,
    backgroundColor: "white",
    position: "absolute",
    marginStart: 25,
    bottom: 40,
  },
  label: {
    color: "#0E55A7",
    fontSize: 15,
    fontWeight: "400",
    marginStart: 5,
  },
  passwordVisibilityIcon: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  checkBox: {
    marginTop: 5,
    flexDirection: "row",
  },
  buttonLogin: {
    marginTop: 50,
    width: 320,
    backgroundColor: "#0E55A7",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  textButton: {
    fontSize: 20,
    color: "white",
    fontWeight: "400",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent white background
  },
});
