import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import AxiosIntance from "../util/AxiosIntance";
import Toast from "react-native-toast-message";
import ItemListService from "./ItemListService";

const ManagerService = () => {
  const [data, setData] = useState([]);
  const [numColumns, setNumColumns] = useState(2);
  const [addedServicesCount, setAddedServicesCount] = useState(0);

  const handleServiceAdded = () => {
    setAddedServicesCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosIntance().get("/service/list");
        const apiData = response;
        setData(apiData);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Không lấy được dữ liệu",
        });
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        numColumns={numColumns}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ItemListService item={item} onAddToCart={handleServiceAdded} />
        )}
      />
      {addedServicesCount > 0 && (
        <View
          style={styles.frameCart}
        >
          <Text style={styles.textCart}>{`Số dịch vụ đã thêm: ${addedServicesCount}`}</Text>
        </View>
      )}
    </View>
  );
};

export default ManagerService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  frameCart:{
    position: "absolute",
    bottom: 10,
    left: 50,
    right: 50,
    backgroundColor: "white",
    height: "10%",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,

    elevation: 24,
    justifyContent: 'center',
    padding: 10
  },
  textCart: {
    fontSize: 15,
  }
});
