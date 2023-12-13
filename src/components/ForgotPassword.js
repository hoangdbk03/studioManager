import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import AxiosIntance from "../util/AxiosIntance";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

const ForgotPassword = () => {
  const [emailrq, setEmailrq] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // Bước mặc định là 1
  const [countdown, setCountdown] = useState(120); // Thời gian đếm ngược
  const navigation = useNavigation();

  // Sử dụng biến để kiểm soát disable
  const emailDisabled = step !== 1;
  const codeDisabled = step !== 2 || countdown === 0;
  const newPasswordDisabled = step !== 3;

  // TODO: Xử lý api gửi mã code về email
  const handleEmail = async () => {
    if (!emailrq) {
      Alert.alert("Thông báo", "Vui lòng nhập địa chỉ email.");
      return;
    }

    try {
      const response = await AxiosIntance().get("/user/forgot-password", {
        params: { email: emailrq },
      });
      if (response.status === true) {
        setStep(2); // Chuyển sang bước 2 khi gửi yêu cầu thành công
        startCountdown(); // Bắt đầu đếm ngược
        Alert.alert(
          "Thông báo",
          "Mã xác nhận đã được gửi, vui lòng kiểm tra email!"
        );
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Email không tồn tại",
      });
    }
  };

  // Bắt đầu đếm ngược
  const startCountdown = () => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Hủy đếm ngược khi component unmount
    return () => clearInterval(interval);
  };

  // TODO: Xử lý api gửi mã xác nhận
  const handleCode = async () => {
    if (!code) {
      Alert.alert("Thông báo", "Vui lòng nhập mã xác thực.");
      return;
    }

    try {
      const response = await AxiosIntance().post(
        "/user/verify-confirmation-code",
        {
          email: emailrq,
          confirmationCode: code,
        }
      );
      if (response.status === true) {
        setStep(3); // Chuyển sang bước 3 khi mã xác nhận chính xác
        Toast.show({
          type: "success",
          text1: "Xác nhận thành công vui lòng nhập mật khẩu mới.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Mã xác nhận không chính xác!",
      });
    }
  };

  // TODO: Xử lý api đặt mật khẩu mới
  const handleNewPass = async () => {
    if (!newPassword) {
      Alert.alert("Thông báo", "Vui lòng mật khẩu mới");
      return;
    }

    try {
      const response = await AxiosIntance().put("/user/reset-password/", {
        email: emailrq,
        newPassword: newPassword,
      });
      if (response.status === true) {
        Toast.show({
          type: "success",
          text1: "Đổi mật khẩu thành công",
        });
        navigation.navigate("Login");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Đổi mật khẩu không thành công",
      });
    }
  };

  // Reset countdown khi quay lại bước 1
  useEffect(() => {
    if (step === 1) {
      setCountdown(120);
    }
  }, [step]);

  // Kiểm tra khi countdown hết và chuyển về màn hình Login
  useEffect(() => {
    if (countdown === 0 && step === 2) {
      navigation.navigate("Login");
    }
  }, [countdown, step, navigation]);


  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nhập Email của bạn"
        style={styles.input}
        onChangeText={(text) => setEmailrq(text)}
        autoCapitalize="none"
        disabled={emailDisabled}
        mode="outlined"
        activeOutlineColor="#90b1d7"
        outlineColor="#90b1d7"
      />
      {step >= 2 && (
        <TextInput
          placeholder="Nhập mã xác nhận"
          style={styles.input}
          onChangeText={(text) => setCode(text)}
          disabled={codeDisabled}
          mode="outlined"
          activeOutlineColor="#90b1d7"
          outlineColor="#90b1d7"
          secureTextEntry
        />
      )}
      {step === 3 && (
        <TextInput
          placeholder="Nhập mật khẩu mới"
          style={styles.input}
          secureTextEntry
          onChangeText={(text) => setNewPassword(text)}
          disabled={newPasswordDisabled}
          mode="outlined"
          activeOutlineColor="#90b1d7"
          outlineColor="#90b1d7"
        />
      )}

      <View style={{ flex: 1, justifyContent: "flex-end", marginBottom: 10 }}>
        {step === 1 && (
          <TouchableOpacity style={styles.buttonRq} onPress={handleEmail}>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Gửi yêu cầu
            </Text>
          </TouchableOpacity>
        )}
        {step === 2 && (
          <TouchableOpacity style={styles.buttonRq} onPress={handleCode}>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Xác nhận mã ({countdown}s)
            </Text>
          </TouchableOpacity>
        )}
        {step === 3 && (
          <TouchableOpacity style={styles.buttonRq} onPress={handleNewPass}>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Đổi mật khẩu
            </Text>
          </TouchableOpacity>
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <Text>Bạn đã có tài khoản? </Text>
          <Text
            style={{ color: "#0E55A7", fontWeight: "bold" }}
            onPress={() => navigation.navigate("Login")}
          >
            Đăng nhập
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  input: {
    height: 50,
    paddingHorizontal: 10,
    marginTop: 20,
    backgroundColor: "#f5f5f5",
  },
  buttonRq: {
    backgroundColor: "#0E55A7",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
});
