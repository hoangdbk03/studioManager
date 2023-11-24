import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Modal, Portal } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Skeleton } from "moti/skeleton";
import Animated, { FadeIn, Layout } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

const ItemListStaff = (props) => {
  const { item, onDelete } = props;
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleLongPress = () => {
    setModalVisible(true);
  };
  const hideModal = () => {
    setModalVisible(false);
  };

  const handlePhonePress = () => {
    if (item.phone) {
      const phoneUrl = `tel:${item.phone}`;
      Linking.openURL(phoneUrl);
    }
  };

  const handleDetailStaff = () => {
    navigation.navigate("DetailStaff", { item });
  };

  const handleDelete = () =>{
    onDelete(item._id);
    hideModal();
  }

  const skeletonStyle = {
    colorMode: "light",
    backgroundColor: "#d4d4d4",
    transition: {
      type: "timing",
      duration: 2000,
    },
  };

  return (
    <TouchableWithoutFeedback onLongPress={handleLongPress}>
      <View style={styles.container}>
        <Skeleton.Group show={item == null}>
          <View style={styles.header}>
            <Skeleton
              width={60}
              height={60}
              radius={"round"}
              {...skeletonStyle}
            >
              {item && (
                <Animated.View layout={Layout} entering={FadeIn.duration(1500)}>
                  <Avatar.Image
                    style={styles.frameAvatar}
                    size={60}
                    source={
                      item && item.avatar
                        ? { uri: item.avatar }
                        : require("../icons/user.png")
                    }
                  />
                </Animated.View>
              )}
            </Skeleton>
            <View style={styles.name_email}>
              <View>
                <Skeleton width={"60%"} height={20} {...skeletonStyle}>
                  {item && (
                    <Animated.View
                      layout={Layout}
                      entering={FadeIn.duration(1500)}
                    >
                      <Text style={styles.textName}>{item.name}</Text>
                    </Animated.View>
                  )}
                </Skeleton>
              </View>
              <View style={{ marginTop: 3 }}>
                <Skeleton width={"60%"} height={10} {...skeletonStyle}>
                  {item && (
                    <Animated.View
                      layout={Layout}
                      entering={FadeIn.duration(1500)}
                    >
                      <Text style={styles.textEmail}>{item.email}</Text>
                    </Animated.View>
                  )}
                </Skeleton>
              </View>
            </View>
          </View>

          <View style={{ marginTop: 5 }}>
            <Skeleton width={"100%"} height={30} {...skeletonStyle}>
              {item && (
                <Animated.View layout={Layout} entering={FadeIn.duration(1500)}>
                  <View style={styles.contact}>
                    <View style={styles.role}>
                      <Image
                        style={{ width: 20, height: 20 }}
                        source={require("../icons/card_staff.png")}
                      />
                      {item && <Text style={styles.textRole}>{item.role}</Text>}
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <FontAwesome5 name="phone-alt" />
                      <Text
                        onPress={handlePhonePress}
                        style={{ fontSize: 13, marginStart: 5, color: item.phone ? 'black' : 'gray' }}
                      >
                        {item.phone || 'Chưa cập nhật'}
                      </Text>
                    </View>
                  </View>
                </Animated.View>
              )}
            </Skeleton>
          </View>

          <View
            style={{
              width: "100%",
              alignItems: "center",
              marginTop: 3,
              marginBottom: 3,
            }}
          >
            <View
              style={{ height: 1, width: "95%", backgroundColor: "#e6e6e6" }}
            />
          </View>
          <Skeleton width={"100%"} height={25} {...skeletonStyle}>
            <TouchableOpacity onPress={handleDetailStaff}>
              {item && (
                <View style={styles.detailUser}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <FontAwesome5 name="user-alt" size={12} color={"#90b1d7"} />
                    <Text
                      style={{ color: "#90b1d7", marginStart: 5, fontSize: 13 }}
                    >
                      Xem chi tiết...
                    </Text>
                  </View>
                  <MaterialIcons
                    name="navigate-next"
                    size={20}
                    color={"#90b1d7"}
                    style={{ marginEnd: 10 }}
                  />
                </View>
              )}
            </TouchableOpacity>
          </Skeleton>
        </Skeleton.Group>
        <Portal>
          <Modal
            visible={isModalVisible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modalContainer}
          >
            <TouchableOpacity onPress={handleDelete} style={styles.frameText}>
              <Text>Xóa</Text>
              {item && (
                <Text>
                  [{item.role}] {item.name}
                </Text>
              )}
            </TouchableOpacity>
          </Modal>
        </Portal>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ItemListStaff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e7eef6",
    marginTop: 10,
    padding: 10,
    borderRadius: 15,
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
    height: 60,
    justifyContent: "center",
  },
  role: {
    flexDirection: "row",
    alignItems: "center",
  },
  frameAvatar: {
    borderRadius: 30,
    width: 60,
    height: 60,
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
    color: "#062446",
    fontWeight: "500",
  },
  textEmail: {
    fontSize: 13,
    color: "#8a8a8a",
  },
  textRole: {
    fontSize: 12,
    marginStart: 5,
    color: "#062446",
  },
  detailUser: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginStart: 10,
    alignItems: "center",
    marginTop: 5,
  },
  contact: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginStart: 10,
  },
  dots: {
    position: "absolute",
    alignSelf: "flex-end",
    marginTop: 10,
    end: 10,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  frameText: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#e7eef6",
    height: 50,
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
  },
});
