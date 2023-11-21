import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar } from "react-native-paper";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { Skeleton } from "moti/skeleton";
import Animated, { FadeIn, Layout } from "react-native-reanimated";

const ItemListStaff = (props) => {
  const { item } = props;

  const handlePhonePress = () => {
    if (item.phone) {
      const phoneUrl = `tel:${item.phone}`;
      Linking.openURL(phoneUrl);
    }
  };

  const skeletonStyle = {
    colorMode: "light",
    backgroundColor: "#d4d4d4",
    transition: {
      type: "timing",
      duration: 2000,
    },
  };

  return (
    <View style={styles.container}>
      <Skeleton.Group show={item == null}>
        <View style={styles.header}>
          <Skeleton width={60} height={60} radius={"round"} {...skeletonStyle}>
            {item && (
              <Animated.View layout={Layout} entering={FadeIn.duration(1500)}>
                <Avatar.Image
                  style={styles.frameAvatar}
                  size={60}
                  source={{ uri: item.avatar }}
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
                  <View style={{ flexDirection: "row" }}>
                    <Text style={{ color: "#062446", fontSize: 13 }}>
                      Liên hệ:{" "}
                    </Text>
                    <Text onPress={handlePhonePress} style={{ fontSize: 13 }}>
                      {item.phone}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            )}
          </Skeleton>
        </View>

        <View style={{ marginTop: 5 }}>
          <Skeleton width={"100%"} height={25} {...skeletonStyle}>
            {item && (
              <View style={styles.detailUser}>
                <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <FontAwesome5 name="user-alt" size={12} color={"#90b1d7"} />
                  <Text style={{ color: "#90b1d7", marginStart: 5 }}>
                    Xem chi tiết...
                  </Text>
                </TouchableOpacity>
                <MaterialIcons
                  name="navigate-next"
                  size={20}
                  color={"#90b1d7"}
                  style={{ marginEnd: 10 }}
                />
              </View>
            )}
          </Skeleton>
        </View>
      </Skeleton.Group>
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
    shadowOpacity: 0.20,
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
});
