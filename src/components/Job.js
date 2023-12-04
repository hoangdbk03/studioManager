import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const Job = () => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            width: 150,
            height: 150,
            backgroundColor: "#e7eef6",
            borderRadius: 300,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: 60, height: 60, tintColor: "#b4cae4" }}
            source={require("../img/taskList.png")}
          />
        </View>
        <Text style={{ color: "#545454", marginTop: 10 }}>
          Chưa có công việc
        </Text>
      </View>
    </View>
  );
};

export default Job;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },

});
