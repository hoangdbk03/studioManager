import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import Ant from "react-native-vector-icons/AntDesign";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Axios } from "axios";
import AxiosIntance from "../util/AxiosIntance";
import Toast from "react-native-toast-message";

const dataRole = [
  { label: "Quản lý", value: "1" },
  { label: "Nhân viên", value: "1" },
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
  const [emailClient, setemailClient] = useState("");
  const [nameClient, setnameClient] = useState("");
  const [roleClient, setroleClient] = useState("");
  const [jobClient, setjobeClient] = useState("");
  const handleRegister = async() =>{

    if (!emailClient || !nameClient || !roleValue) {
      Toast.show({
        type: "info",
        text1: "VUI LÒNG NHẬP ĐẦY ĐỦ THÔNG TIN."
      })
    }

    const dataRegister ={
      email: emailClient,
      name: nameClient,
      role: jobClient,
      job: jobClient
    }

    try {
      const response = await AxiosIntance().post('/user/register', dataRegister);

      if (response) {
        Toast.show({
          type: "success",
          text1: response.message
        });

        setemailClient("");
        setnameClient("");
        setroleClient(null);
        setjobeClient(null);
      }else{
        Toast.show({
          type: "error",
          text1: response.message
        })
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: response.message
      })
    }
  };
  
  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require("../img/backgroundSpl.jpg")} />
      
      <View style={styles.bar} />
      <View>
        <View style={styles.inputEmail}>
          <TextInput
            style={styles.textInput}
            placeholder="example@gmail.com"
            underlineColor="red"
            onChangeText={setemailClient}
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
          <TextInput style={styles.textInput} placeholder="Nguyễn Văn A" onChangeText={setnameClient}/>
        </View>
        <View style={styles.viewLabelName}>
          <Text Text style={styles.label}>
            Họ và tên
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
        placeholder="Chọn ban nhân sự"
        searchPlaceholder="Search..."
        value={roleValue}
        onChange={(item) => {
          setroleValue(item.value);
        }}
        onChangeText={setroleClient}
        renderLeftIcon={() => (
          <Icon style={styles.icon} name="add-moderator" size={20} />
        )}
      />

      {/* vai trò công việc*/}

      <Dropdown
        style={[styles.dropdown, { borderColor: "#0E55A7", marginTop: 30 }]}
        inputSearchStyle={styles.inputSearchStyle}
        data={dataWork}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Vai trò"
        searchPlaceholder="Search..."
        value={workValue}
        onChange={(item) => {
          setworkValue(item.value);
        }}
        onChangeText={setjobeClient}
        renderLeftIcon={() => (
          <Ant style={styles.icon} name="idcard" size={20} />
        )}
      />

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
    width: '80%',
    height: '30%',
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
