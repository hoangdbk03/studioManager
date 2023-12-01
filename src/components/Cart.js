import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import ItemListCart from './ItemListCart';
import AxiosIntance from '../util/AxiosIntance';
import { AppConText } from '../util/AppContext';
import Toast from "react-native-toast-message";

const Cart = () => {

  const [data, setData] = useState([]);
  const {inforUser} = useContext(AppConText);

  // gọi api danh sách giỏ hàng
  const fetchData = async()=>{
    try {
      const response = await AxiosIntance().get(`/cart/list/${inforUser._id}`);
      const apiData = response.items;
      setData(apiData);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Không lấy được dữ liệu",
      });
    }
  }

  useEffect(() =>{
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => (
          <ItemListCart item={item}/>
  )}
      />
    </View>
  )
}

export default Cart

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'white',
    padding: 10
  }
})