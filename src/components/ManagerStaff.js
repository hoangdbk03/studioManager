import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useMemo, useState } from "react";
import AxiosIntance from "../util/AxiosIntance";
import Toast from "react-native-toast-message";
import ItemListStaff from "./ItemListStaff";
import { AppConText } from "../util/AppContext";
import { Skeleton } from "moti/skeleton";

const ManagerStaff = () => {
  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const { inforUser } = useContext(AppConText);

  const listPlaceholder = useMemo(() =>{
    return Array.from({length: 15}).map(_ => null);
  }, []);

  const fetchData = async () => {
    try {
      const response = await AxiosIntance().get("/user/list");
      const apiData = response;
      await new Promise(resolve => setTimeout(resolve, 2000));
      setdata(apiData);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lấy danh sách thất bại",
      });
    }finally {
      setLoading(false); // Set loading to false after data is fetched
    }
    
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        // Render Skeleton while data is loading
        <FlatList
          data={listPlaceholder}
          keyExtractor={(_, index) => index.toString()}
          renderItem={() => <ItemListStaff item={null} />} // Pass null as item to Skeleton
        />
      ) : (
      <FlatList
        data={data ?? listPlaceholder}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          if (
            inforUser.role === "Admin" &&
            (item.role === "Quản lý" || item.role === "Nhân viên")
          ) {
            return <ItemListStaff item={item} />;
          } else if (
            inforUser.role === "Quản lý" &&
            item.role === "Nhân viên"
          ) {
            return <ItemListStaff item={item} />;
          }
        }}
      />
      )}
    </View>
  );
};

export default ManagerStaff;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
    flex: 1,
  },
});
