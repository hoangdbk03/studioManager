import {
  Animated,
  Easing,
  Image,
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

const Login = () => {

  const {setisLogin, setinforUser} = useContext(AppConText);

  const [emailUser, setemailUser] = useState("");
  const [passwordUser, setpasswordUser] = useState("");

  const goLogin = async () => {
    try {
      const response = await AxiosIntance().post("/user/login", {
        email: emailUser,
        password: passwordUser,
      });

      if (response.loggedin) {
        ToastAndroid.show("Đăng nhập thành công", ToastAndroid.SHORT);
        setisLogin(true);
        setinforUser(response);
      } else {
        ToastAndroid.show("Mật khẩu không chính xác!", ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show("Email đăng nhập không tồn tại!", ToastAndroid.SHORT);
    }
  };

  const [isPasswordVisible, setisPasswordVisible] = useState(false);
  const [checked, setchecked] = useState(false);

  const translateY = new Animated.Value(300);

  const togglePasswordVisibility = () => {
    setisPasswordVisible(!isPasswordVisible);
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
    <View style={styles.container}>
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
                status={checked ? "checked" : "unchecked"}
                onPress={() => {
                  setchecked(!checked);
                }}
                color="#0E55A7"
                uncheckedColor="#0E55A7"
              />
              <Text style={{ color: "#0E55A7", top: 8 }}>Ghi nhớ mật khẩu</Text>
            </View>
            <Text
              style={{
                marginLeft: 70,
                top: 12,
                color: "#0E55A7",
                textDecorationLine: "underline",
              }}
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
    </View>
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
    marginTop: 80,
  },
  imgFont: {
    width: '100%',
    position: 'absolute',
    marginTop: 250
  },
  fontLogin: {
    width: '100%',
    height: '100%',
    backgroundColor: "white",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: 50,
    alignItems: "center",
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
  },
  textButton: {
    fontSize: 20,
    color: "white",
    fontWeight: "400",
  },
});
