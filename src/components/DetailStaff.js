import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import AxiosIntance from "../util/AxiosIntance";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { format, parseISO } from "date-fns";

const genderOptions = [
  { label: "Nam", value: "1" },
  { label: "Nữ", value: "2" },
  { label: "Khác", value: "3" },
];

const roleOptions = [
  { label: "Quản lý", value: "1" },
  { label: "Nhân viên", value: "2" },
];

const jobOptions = [
  { label: "Trống", value: "1" },
  { label: "Photographer", value: "2" },
  { label: "Trợ lý Photographer", value: "3" },
  { label: "Makeup", value: "4" },
  { label: "Hậu kỳ", value: "5" },
  { label: "Editor", value: "6" },
  { label: "Kỹ thuật", value: "7" },
  { label: "Tài xế", value: "8" },
];

const DetailStaff = ({ route }) => {
  const { item } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [nameUser, setNameUser] = useState(item.name);
  const [selectedGender, setSelectedGender] = useState(item.gender);
  const [birthday, setBirthday] = useState(item.birthday);
  const [email, setEmail] = useState(item.email);
  const [phone, setPhone] = useState(item.phone);
  const [role, setRole] = useState(item.role);
  const [job, setJob] = useState(item.job);
  const [citizenIdentityCard, setCitizenIdentityCard] = useState(
    item.citizenIdentityCard
  );

  // chỉnh lại ngày tạo
  const createdDate = item ? item.createdAt : null;
  const dateTimeCreated = createdDate ? parseISO(createdDate) : null;
  const formattedCreated = dateTimeCreated
    ? format(dateTimeCreated, "dd/MM/yyyy HH:mm:ss")
    : null;
  //chỉnh lại ngày update
  const updatedDate = item ? item.updatedAt : null;
  const dateTimeUpdated = updatedDate ? parseISO(updatedDate) : null;
  const formattedUpdate = dateTimeUpdated
    ? format(dateTimeUpdated, "dd/MM/yyyy HH:mm:ss")
    : null;

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const getLabelFromOptions = (options, value) => {
        const option = options.find((item) => item.value === value);
        return option ? option.label : "";
      };
      const dataUpdate = {
        name: nameUser,
        gender: getLabelFromOptions(genderOptions, selectedGender),
        birthday,
        email,
        phone,
        citizenIdentityCard,
        role: getLabelFromOptions(roleOptions, role),
        job: getLabelFromOptions(jobOptions, job),
      };

      // kiểm tra nếu trống sẽ delete không cho trường đó cập nhật
      if (!selectedGender) delete payload.gender;
      if (!role) delete payload.role;
      if (!job) delete payload.job;
      await AxiosIntance().put(`/user/update/${item._id}`, dataUpdate);
      Toast.show({
        type: "success",
        text1: "Lưu thành công",
      });
      navigation.navigate("ManagerStaff", { refresh: true });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lưu thất bại",
      });
    }finally{
      setLoading(false);
    }
  };

  const styleInput = {

    activeOutlineColor: "#0E55A7",
    outlineColor: "#8a8a8a",
    outlineStyle: { borderRadius: 10, borderWidth: 1.5 },
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Avatar.Image
          source={
            item && item.avatar
              ? { uri: item.avatar }
              : require("../icons/user.png")
          }
          size={120}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.body}>
          <TextInput
            {...styleInput}
            style={[styles.input, styles.inputName]}
            mode="outlined"
            value={nameUser}
            label="Họ và tên"
            onChangeText={(text) => setNameUser(text)}
          />
          <View style={styles.birthday_gender}>
            <TextInput
              style={styles.inputBirthday}
              mode="outlined"
              value={birthday}
              label="Năm sinh"
              {...styleInput}
              onChangeText={(text) => setBirthday(text)}
            />
             <Dropdown
              style={[styles.dropdown, { width: "30%", marginTop: 5 }]}
              data={roleOptions}
              value={role}
              maxHeight={300}
              labelField="label"
              valueField="value"
              containerStyle={{borderRadius: 10}}
              placeholder={role ? item.role : "Vai trò"}
              onChange={(item) => {
                setRole(item.value);
              }}
              onChangeText={(value) => setRole(value)}
            />
            <Dropdown
              style={[styles.dropdown, { width: "30%",  marginTop: 5  }]}
              data={genderOptions}
              value={selectedGender}
              maxHeight={300}
              labelField="label"
              valueField="value"
              containerStyle={{borderRadius: 10}}
              placeholder={selectedGender ? item.gender : "Giới tính"}
              onChange={(item) => {
                setSelectedGender(item.value);
              }}
              onChangeText={(value) => setSelectedGender(value)}
            />
          </View>
          <TextInput
            style={[styles.input, styles.inputRemaining]}
            mode="outlined"
            value={email}
            label="Email"
            {...styleInput}
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={[styles.input, styles.inputRemaining]}
            mode="outlined"
            value={phone}
            label="Số điện thoại"
            keyboardType="numeric"
            {...styleInput}
            onChangeText={(text) => setPhone(text)}
          />
            <Dropdown
              style={[styles.dropdown, { width: "90%",  marginTop: 10 }]}
              data={jobOptions}
              value={job}
              maxHeight={300}
              labelField="label"
              valueField="value"
              containerStyle={{borderRadius: 10}}
              placeholder={job ? item.job : "Công việc"}
              onChange={(item) => {
                setJob(item.value);
              }}
              onChangeText={(value) => setJob(value)}
            />
          <TextInput
            style={[styles.input, styles.inputRemaining]}
            mode="outlined"
            value={citizenIdentityCard}
            label="CMT/CCCD"
            {...styleInput}
            onChangeText={(text) => setCitizenIdentityCard(text)}
          />
          <TextInput
            style={[styles.input, styles.inputRemaining]}
            mode="outlined"
            value={formattedCreated}
            label="Ngày tạo"
            {...styleInput}
            disabled
          />
          <TextInput
            style={[styles.input, styles.inputRemaining]}
            mode="outlined"
            value={formattedUpdate}
            label="Cập nhật mới nhất"
            {...styleInput}
            disabled
          />
          <TouchableOpacity style={styles.buttonSave} onPress={handleUpdate}>
            <Text style={{color: 'white', fontSize: 15, fontWeight: '500'}}>Lưu</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {loading && (
        <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0E55A7" />
      </View>
      )}
    </View>
  );
};

export default DetailStaff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#062446",
  },
  avatar: {
    padding: 20,
  },
  name: {
    flexDirection: "row",
  },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "#f9f9f9",
  },
  inputName: {
    marginTop: 30,
  },
  inputBirthday: {
    width: '35%',
    height: 50,
    backgroundColor: "#f9f9f9",
  },
  inputRemaining: {
    marginTop: 10,
  },
  body: {
    flex: 1,
    alignItems: "center",
  },
  dropdown: {
    height: 53,
    borderColor: "#8a8a8a",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 8,
    backgroundColor: '#f9f9f9',
  },
  birthday_gender: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  buttonSave: {
    backgroundColor: "#0E55A7",
    width: 150,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10
  },
  scrollView: {
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "white",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Semi-transparent white background
  },
});
