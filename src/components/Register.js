import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import Ant from "react-native-vector-icons/AntDesign";
import Icon from "react-native-vector-icons/MaterialIcons";
import AxiosIntance from "../util/AxiosIntance";
import Toast from "react-native-toast-message";


const dataRole = [
  { label: "Quản lý", value: "1" },
  { label: "Nhân viên", value: "2" },
];

const dataWork = [
  { label: "Photographer", value: "1" },
  { label: "Trợ lý Photographer", value: "2" },
  { label: "Makeup", value: "3" },
  { label: "Hậu kỳ", value: "4" },
  { label: "Editor", value: "5" },
  { label: "Kỹ thuật", value: "6" },
  { label: "Tài xế", value: "7" },
];

const Register = () => {
  const [roleValue, setroleValue] = useState(null);
  const [workValue, setworkValue] = useState(null);
  const [emailUser, setemailUser] = useState("");
  const [nameUser, setnameUser] = useState("");
  const [cccdUser, setCccdUser] = useState("");
  const [roleUser, setroleUser] = useState("");
  const [jobUser, setjobUser] = useState("");
  const [isJobVisible, setisJobVisible] = useState(false);

  //xử lý clear text khi đăng ký thành công
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const cccdRef = useRef(null);

  const clearTextInput = (ref) => {
    if (ref.current) {
      ref.current.clear();
    }
  };

  //valid cho các trường
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isNameValid = (name) => {
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    return nameRegex.test(name);
  };

  const isCccdValid = (cccd) => {
    const cccdRegex = /^[0-9]{12}$/;
    return cccdRegex.test(cccd);
  };

  const handleRegister = () => {
    let errorMessage = "";

    if (!emailUser || !nameUser || !cccdUser || !roleValue) {
      errorMessage = "Vui lòng nhập đầy đủ thông tin!";
    } else if (!isEmailValid(emailUser)) {
      errorMessage = "Email không đúng định dạng!";
    } else if (!isNameValid(nameUser)) {
      errorMessage = "Họ tên không được nhập số!";
    } else if (!isCccdValid(cccdUser)) {
      errorMessage = "CMT/CCCD không chính sác!";
    } else if (!setroleValue) {
      errorMessage = "Họ tên không được nhập số";
    }

    if (errorMessage) {
      Toast.show({
        type: "info",
        text1: errorMessage,
      });
    } else {
      resAPI();
    }
  };

  const resAPI = async () => {
    const dataRegister = {
      email: emailUser,
      name: nameUser,
      role: roleValue
        ? dataRole.find((item) => item.value === roleValue).label
        : "",
      job: workValue
        ? dataWork.find((item) => item.value === workValue).label
        : "",
      citizenIdentityCard: cccdUser,
    };

    try {
      const response = await AxiosIntance().post(
        "/user/register",
        dataRegister
      );

      if (response) {
        Toast.show({
          type: "success",
          text1: response.message,
        });

        //reset lại các ô nhập
        setroleValue(null);
        setworkValue(null);
        setroleUser("");
        setjobUser("");
        setisJobVisible(false);
        clearTextInput(emailRef);
        clearTextInput(nameRef);
        clearTextInput(cccdRef);

        // focus về ô nhập email
        emailRef.current.focus();
      } else {
        Toast.show({
          type: "error",
          text1: response.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: response.message,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require("../img/backgroundSpl.jpg")} />

      <View style={styles.bar} />
      <View>
        <View style={styles.inputEmail}>
          <TextInput
            ref={emailRef}
            style={styles.textInput}
            placeholder="example@gmail.com"
            underlineColor="red"
            onChangeText={setemailUser}
          />
        </View>
        <View style={styles.viewLabelEmail}>
          <Text Text style={styles.label}>
            Email
          </Text>
        </View>
      </View>
      <View>
        <View style={styles.inputName}>
          <TextInput
            ref={nameRef}
            style={styles.textInput}
            placeholder="Nguyễn Văn A"
            onChangeText={setnameUser}
          />
        </View>
        <View style={styles.viewLabelName}>
          <Text Text style={styles.label}>
            Họ và tên
          </Text>
        </View>
      </View>
      <View>
        <View style={styles.inputName}>
          <TextInput
            ref={cccdRef}
            style={styles.textInput}
            placeholder="Nhập số CMT/CCCD"
            onChangeText={setCccdUser}
            keyboardType="numeric"
            maxLength={12}
          />
        </View>
        <View style={styles.viewLabelCccd}>
          <Text Text style={styles.label}>
            CMT/CCCD
          </Text>
        </View>
      </View>

      {/* chọn ban nhân sự => quản lý or nhân viên */}
      <Dropdown
        style={[styles.dropdown, { borderColor: "#0E55A7" }]}
        inputSearchStyle={styles.inputSearchStyle}
        data={dataRole}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Vị trí công việc"
        searchPlaceholder="Search..."
        value={roleValue}
        onChange={(item) => {
          setroleValue(item.value);
          setisJobVisible(item.value === "2");
        }}
        onChangeText={setroleUser}
        renderLeftIcon={() => (
          <Icon style={styles.icon} name="add-moderator" size={20} />
        )}
      />

      {/* vai trò công việc*/}

      {isJobVisible && (
        <Dropdown
          style={[styles.dropdown, { borderColor: "#0E55A7", marginTop: 30 }]}
          inputSearchStyle={styles.inputSearchStyle}
          data={dataWork}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Loại công việc"
          searchPlaceholder="Search..."
          value={workValue}
          onChange={(item) => {
            setworkValue(item.value);
          }}
          onChangeText={setjobUser}
          renderLeftIcon={() => (
            <Ant style={styles.icon} name="idcard" size={20} />
          )}
        />
      )}

      <TouchableOpacity style={styles.buttonRegister} onPress={handleRegister}>
        <Text style={styles.textButton}>Đăng Ký</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  img: {
    width: "80%",
    height: "30%",
  },
  loginText: {
    color: "#0E55A7",
    fontWeight: "400",
    fontSize: 26,
    marginTop: 30,
  },
  bar: {
    width: 80,
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
  inputName: {
    width: 320,
    height: 50,
    borderWidth: 3,
    borderRadius: 12,
    borderColor: "#0E55A7",
    marginTop: 30,
  },
  textInput: {
    height: 40,
    marginStart: 28,
    top: 5,
  },
  viewLabelEmail: {
    width: 50,
    backgroundColor: "white",
    position: "absolute",
    marginStart: 25,
    top: 30,
  },
  viewLabelName: {
    width: 80,
    backgroundColor: "white",
    position: "absolute",
    marginStart: 25,
    bottom: 40,
  },
  viewLabelCccd: {
    width: 90,
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
  buttonRegister: {
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
  dropdown: {
    marginTop: 30,
    width: 320,
    height: 50,
    borderBlockColor: "#0E55A7",
    borderWidth: 3,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  dropdown2: {
    width: 320,
    height: 50,
    borderBlockColor: "#0E55A7",
    borderWidth: 3,
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 10,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
