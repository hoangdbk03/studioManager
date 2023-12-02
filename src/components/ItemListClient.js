import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

const ItemListClient = (props) => {
  const { item, index } = props;

  return (
    <View style={styles.container}>
      <Text>{index + 1}</Text>
      <View style={styles.container1}>
        <Text style={styles.textName}>{item.name}</Text>
        <Text style={{color: '#313e4d'}}>{item.phone}</Text>
      </View>
    </View>
  );
};

export default ItemListClient;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f7fbff",
    padding: 20,
    borderColor: "#cfcfcf",
    justifyContent: "space-between",
    marginTop: 10,
    borderRadius: 10,
  },
  container1: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "88%",
  },
  textName: { color: "#0E55A7", fontWeight: "bold" },
});
