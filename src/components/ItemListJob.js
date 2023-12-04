import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ScrollView } from "react-native";
import { format, parseISO } from "date-fns";

const ItemListJob = (props) => {
  const { item } = props;

  // chỉnh lại định dạng ngày bắt đầu
  const createdDate = item ? item.started : null;
  const dateTimeCreated = createdDate ? parseISO(createdDate) : null;
  const formattedStart = dateTimeCreated
    ? format(dateTimeCreated, "dd/MM/yyyy HH:mm:ss")
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        {item.services.map((service) => (
          <View key={service._id} style={styles.serviceContainer}>
            <Text style={styles.textNameService}>{service.serviceID.name}</Text>
          </View>
        ))}

        <Text style={{ color: "#8a8a8a" }}>Khách hàng: {item.client.name}</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.avatarList}
        >
          {item.staffs.map((staff) => (
            <View key={staff._id} style={styles.staffContainer}>
              <Image
                style={styles.serviceImage}
                source={{ uri: staff.staffID.avatar }}
              />
            </View>
          ))}
        </ScrollView>

        <Text style={styles.textStatus}>{item.status}</Text>
        <View style={{ height: 1, backgroundColor: "#e6e6e6" }}></View>
        <Text style={{ marginTop: 5, color: "#b0b0b0" }}>
          Ngày bắt đầu: {formattedStart}
        </Text>
      </View>
    </View>
  );
};

export default ItemListJob;

const styles = StyleSheet.create({
  container: {
    padding: 5,
  },
  container1: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 5,
  },
  serviceImage: {
    width: 30,
    height: 30,
    borderRadius: 100,
    flexDirection: "row",
  },
  staffContainer: {
    width: 31,
    height: 31,
    backgroundColor: "white",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: -12,
  },
  avatarList: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  textNameService: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1f2633",
  },
  textStatus: {
    alignSelf: "flex-end",
    color: "#545454",
  },
});
