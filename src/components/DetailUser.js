import {
  ActivityIndicator,
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
import { Dropdown } from "react-native-element-dropdown";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";

const genderOptions = [
  { label: "Nam", value: "1" },
  { label: "Nữ", value: "2" },
  { label: "Khác", value: "3" },
];

const DetailUser = () => {
  const { inforUser } = useContext(AppConText);
  const navigation = useNavigation();
  const [dataUser, setDataUser] = useState({});
  const [imageUri, setImageUri] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedGender, setSelectedGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");

  const dateTimeString = dataUser ? dataUser.createdAt : null;

  const dateTime = dateTimeString ? parseISO(dateTimeString) : null;
  const formattedDateTime = dateTime
    ? format(dateTime, "dd/MM/yyyy HH:mm:ss")
    : null;

  // TODO: Gọi API xử lý lấy thông tin người dùng
  const fetchData = async () => {
    try {
      const response = await AxiosIntance().get(
        `/user/detail/${inforUser._id}`
      );
      setDataUser(response);
      setBirthday(response.birthday || "");
      setPhone(response.phone || "");
      setSelectedGender(response.gender || "");
      setImageUri(response.avatar || null);
    } catch (error) {
      console.info("Không có thông tin người dùng");
    }
  };

  // * Mở thư viện chọn hình ảnh
  const openImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setDataUser({ ...dataUser, avatar: result.assets[0].uri });
      setSelectedItem((prevItem) => ({
        ...prevItem,
        avatar: result.assets[0].uri,
      }));
    }
  };
  // TODO: Gọi API cập nhật người dùng
  const updateUser = async () => {
    try {
      // kiểm tra xem có thay đổi gì không
      const avatarChanged = imageUri !== dataUser.avatar;
      const phoneChanged = phone !== dataUser.phone;
      const genderChanged = selectedGender !== dataUser.gender;
      const birthdayChanged = birthday !== dataUser.birthday;

      // nếu không thì không thực hiện api
      if (
        !avatarChanged &&
        !phoneChanged &&
        !genderChanged &&
        !birthdayChanged
      ) {
        Toast.show({
          type: "info",
          text1: "Không có thông tin cần cập nhật",
        });
        return;
      }

      // sửa lại gender được truyền vào là lebal
      const selectedGenderLabel = genderOptions.find(
        (option) => option.value === selectedGender
      )?.label;

      // truyền dạng formData
      const formData = new FormData();
      if (birthday) {
        formData.append("birthday", birthday || "");
      }
      if (phone) {
        formData.append("phone", phone || "");
      }
      if (selectedGenderLabel) {
        formData.append("gender", selectedGenderLabel);
      }

      // Kiểm tra xem hình ảnh có được chọn hay không trước khi thêm vào FormData
      if (imageUri) {
        const imageUriParts = imageUri.split(".");
        const imageFileType = imageUriParts[imageUriParts.length - 1];
        const imageName = `avatar_user_${Date.now()}.${imageFileType}`;
        formData.append("image", {
          uri: imageUri,
          name: imageName,
          type: `image/${imageFileType}`,
        });
      }

      // xử lý api cập nhật
      await AxiosIntance().put(`/user/update/${dataUser._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Toast.show({
        type: "success",
        text1: "Lưu thành công",
      });
      navigation.navigate("Profile", { refresh: true });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lưu thất bại",
      });
    }
  };

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
        <TouchableOpacity
          style={styles.frameAvatar}
          onPress={() => openImageLibrary()}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
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
        <View style={{ flexDirection: "row" }}>
          <TextInput
            {...styleInput}
            mode="outlined"
            label="Ngày sinh"
            placeholder="Nhập ngày sinh"
            value={birthday}
            style={[styles.textInput, { width: 150, marginEnd: 10 }]}
            textColor="#545454"
            onChangeText={(text) => setBirthday(text)}
          />
          <Dropdown
            style={[styles.dropdown, { width: 150, marginTop: 20 }]}
            data={genderOptions}
            value={selectedGender}
            maxHeight={300}
            labelField="label"
            valueField="value"
            containerStyle={{ borderRadius: 10 }}
            placeholder={selectedGender ? dataUser.gender : "Giới tính"}
            onChange={(item) => {
              setSelectedGender(item.value);
            }}
            onChangeText={(value) => setSelectedGender(value)}
          />
        </View>
        <TextInput
          {...styleInput}
          mode="outlined"
          label="Số điện thoại"
          value={phone}
          style={styles.textInput}
          textColor="#545454"
          keyboardType="numeric"
          onChangeText={(text) => setPhone(text)}
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
        <TouchableOpacity style={styles.buttonSave} onPress={updateUser}>
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
  dropdown: {
    height: 53,
    borderColor: "#0E55A7",
    borderWidth: 2.5,
    borderRadius: 12,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
