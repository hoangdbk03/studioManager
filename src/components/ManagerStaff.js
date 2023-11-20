import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AxiosIntance from "../util/AxiosIntance";
import Toast from "react-native-toast-message";
import ItemListStaff from "./ItemListStaff";
import { AppConText } from "../util/AppContext";

const ManagerStaff = () => {
  const [data, setdata] = useState([]);
  const { inforUser } = useContext(AppConText);

  const fetchData = async () => {
    try {
      const response = await AxiosIntance().get("/user/list");
      const apiData = response;
      setdata(apiData);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lấy danh sách thất bại",
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          if (inforUser.role === "Admin" && (item.role === "Quản lý" || item.role === "Nhân viên")) {
            return (
              <TouchableOpacity>
                <ItemListStaff item={item} />
              </TouchableOpacity>
            );
          } else if (
            inforUser.role === "Quản lý" &&
            item.role === "Nhân viên"
          ) {
            return (
              <TouchableOpacity>
                <ItemListStaff item={item} />
              </TouchableOpacity>
            );
          }
        }}
      />
    </View>
  );
};

export default ManagerStaff;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: 'white',
    flex: 1
  },
});
