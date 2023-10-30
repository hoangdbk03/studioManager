import { StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import AxiosIntance from "../util/AxiosIntance";

const ItemListClient = (props) => {
  const {item, index} = props;

  return (
      <View style={styles.container}>
        <Text>{index + 1}</Text>
        <Text>{item.name}</Text>
        <Text>{item.phone}</Text>
      </View>
  );
};

export default ItemListClient;

const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#cfcfcf',
    justifyContent: 'space-between'
  }
});
