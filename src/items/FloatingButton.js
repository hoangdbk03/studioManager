import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { FAB, Portal, PaperProvider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { AppConText } from "../util/AppContext";

const FloatingButton = () => {
  const {inforUser} = useContext(AppConText);
  const navigation = useNavigation();
  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  return (
    <FAB.Group
      style={{ bottom: 84.5 }}
      backdropColor="rgba(225,225,225, 0)"
      fabStyle={{ backgroundColor: "#0E55A7" }}
      color="white"
      open={open}
      visible
      icon={open ? "close" : "plus"}
      actions={[
        {
          icon: require("../icons/list.png"),
          label: "Quản lý khách hàng",
          onPress: () => navigation.navigate('ManagerClient'),
          labelTextColor: "white",
          color: "white",
          containerStyle: { backgroundColor: "#0E55A7" },
          style: { backgroundColor: "#0E55A7"},

          labelStyle: {fontSize: 13}
        },
        inforUser.role !== "Quản lý" &&{
          icon: require("../icons/add-user.png"),
          label: "Đăng ký người dùng",
          onPress: () => navigation.navigate('Register'),
          labelTextColor: "white",
          color: "white",
          containerStyle: { backgroundColor: "#0E55A7" },
          style: { backgroundColor: "#0E55A7" },

          labelStyle: {fontSize: 13}
        },
      ].filter(Boolean)}
      onStateChange={onStateChange}
      onPress={() => {
        if (open) {
          // do something if the speed dial is open
        }
      }}
    />
  );
};

export default FloatingButton;

const styles = StyleSheet.create({});
