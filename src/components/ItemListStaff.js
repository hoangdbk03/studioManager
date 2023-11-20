import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Avatar } from "react-native-paper";

const ItemListStaff = (props) => {
  const { item } = props;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Avatar.Image
            style={styles.frameAvatar}
            size={60}
            source={{ uri: item.avatar }}
          />
        </View>
        <View style={styles.name_email}>
          <Text style={styles.textName}>{item.name}</Text>
          <Text style={styles.textEmail}>{item.email}</Text>
          
        </View>
      </View>
      <View style={styles.role}>
            <Image
              style={{ width: 20, height: 20 }}
              source={require("../icons/card_staff.png")}
            />
            <Text style={styles.textRole}>{item.role}</Text>
          </View>
      <Text>{item.job}</Text>
      <Text>{item.phone}</Text>
    </View>
  );
};

export default ItemListStaff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e7eef6",
    marginTop: 10,
    padding: 10,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  header: {
    flexDirection: "row",
  },
  name_email: {
    marginStart: 10,
  },
  role: {
    flexDirection: "row",
    alignItems: "center",
    marginStart: 70
  },
  frameAvatar: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textName: {
    fontSize: 18,
  },
  textEmail: {
    fontSize: 12,
    color: "#90b1d7",
  },
  textRole: {
    fontSize: 12,
    marginStart: 5,
  },
});
