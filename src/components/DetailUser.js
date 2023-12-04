import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AppConText } from "../util/AppContext";
import AxiosIntance from "../util/AxiosIntance";
import { TextInput } from "react-native-paper";
import { format, parseISO } from "date-fns";
import DropDown from 'react-native-element-dropdown';

const DetailUser = () => {
  const { inforUser } = useContext(AppConText);
  const [dataUser, setDataUser] = useState({});

  const dateTimeString = dataUser ? dataUser.createdAt : null;

  const dateTime = dateTimeString ? parseISO(dateTimeString) : null;
  const formattedDateTime = dateTime
    ? format(dateTime, "dd/MM/yyyy HH:mm:ss")
    : null;

    const [dataUpdate, setDataUpdate] = useState({

    })
    const genderOptions = ['Nam', 'Nữ', 'Khác'];

  // TODO: Gọi API xử lý lấy thông tin người dùng
  const fetchData = async () => {
    try {
      const response = await AxiosIntance().get(
        `/user/detail/${inforUser._id}`
      );
      setDataUser(response);
    } catch (error) {
      console.info("Không có thông tin người dùng");
    }
  };
  // TODO: Gọi API cập nhật người dùng
  const updateUser = async ()=>{
    try {
        await AxiosIntance().put(`/user/update/${dataUser._id}`, )
    } catch (error) {
        
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const styleInput = {
    activeOutlineColor: "#0E55A7",
    outlineColor: "#0E55A7",
    outlineStyle: { borderRadius: 10, borderWidth: 2 },
  };

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.frameAvatar}>
          {dataUser.avatar ? (
            <Image
              source={{ uri: dataUser.avatar }}
              style={{ width: 120, height: 120, borderRadius: 100 }}
            />
          ) : (
            <Image
              source={require("../icons/user.png")}
              style={{ width: 100, height: 100 }}
            />
          )}
        </TouchableOpacity>

        <Text style={styles.textName}>{dataUser.name}</Text>
        <Text style={styles.textEmail}>{dataUser.email}</Text>
        <TextInput
          {...styleInput}
          mode="outlined"
          label="Ngày sinh"
          placeholder="Nhập ngày sinh"
          value={dataUser.birthday}
          style={styles.textInput}
          textColor="#545454"
        />
        <TextInput
          {...styleInput}
          mode="outlined"
          label="Giới tính"
          value={dataUser.gender}
          style={styles.textInput}
          textColor="#545454"
        />
        <TextInput
          {...styleInput}
          mode="outlined"
          label="Số điện thoại"
          value={dataUser.phone}
          style={styles.textInput}
          textColor="#545454"
          keyboardType="numeric"
        />
        <TextInput
          {...styleInput}
          mode="outlined"
          label="Vai trò"
          value={dataUser.role}
          style={styles.textInput}
          disabled={true}
        />
        <TextInput
          {...styleInput}
          mode="outlined"
          label="Công việc"
          value={dataUser.job}
          style={styles.textInput}
          disabled={true}
        />
        <TextInput
          {...styleInput}
          mode="outlined"
          label="CCCD/CMT"
          value={dataUser.citizenIdentityCard}
          style={styles.textInput}
          disabled={true}
        />
        <TextInput
          {...styleInput}
          mode="outlined"
          label="Ngày tạo"
          value={formattedDateTime}
          style={styles.textInput}
          disabled={true}
        />
        <TouchableOpacity style={styles.buttonSave}>
          <Text style={styles.textButton}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DetailUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    marginBottom: 50,
  },
  textInput: {
    width: "90%",
    marginTop: 15,
    backgroundColor: "white",
  },
  frameAvatar: {
    marginTop: 20,
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
  },
  textName: {
    marginTop: 10,
    fontSize: 25,
    fontWeight: "500",
  },
  textEmail: {
    color: "#b0b0b0",
    marginBottom: 10,
  },
  buttonSave: {
    backgroundColor: "#0E55A7",
    width: "90%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  textButton: {
    fontSize: 18,
    color: "white",
    fontWeight: "500",
  },
});
