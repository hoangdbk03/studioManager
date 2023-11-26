import { Image, StyleSheet, Text, TouchableHighlight, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { format, parseISO } from "date-fns";

const ItemListCart = (props) => {
  const { item } = props;
  const [expanded, setExpanded] = useState(false);

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

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={toggleExpansion}>
      <View style={styles.header}>
        <Image style={styles.image} source={{ uri: item.image }} />
        <View>
          <Text>{item.name}</Text>
          <Text>{item.price}</Text>
        </View>
      </View>
      {expanded && (
        <View>
          <Text></Text>
          <Text>{item.description}</Text>
          <Text>Ngày tạo: {formattedCreated}</Text>
          <Text>Cập nhập mới nhất: {formattedUpdate}</Text>
          <Text>{item.status}</Text>
          <TouchableOpacity style={styles.buttonConfirm}>
            <Text style={{color: 'white', fontWeight: '500'}}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ItemListCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e7eef6",
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  header: {
    flexDirection: "row",
  },
  buttonConfirm:{
    width: "100%",
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0E55A7',
    borderRadius: 10
  }
});
