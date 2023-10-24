import { Animated, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Login from "./Login";
import * as Animatable from "react-native-animatable";

const SplashScreen = () => {

  const navigation = useNavigation();
  const translateY = useRef(new Animated.Value(0)).current;

  const [showImgLogo, setshowImgLogo] = useState(true);

  useEffect( ()=>{

    const splashTimer = setTimeout( ()=>{
      setshowImgLogo(false);
      Animated.timing(translateY, {
        toValue: -200,
        duration: 1000,
        useNativeDriver: true,
      }).start( ()=>{
        navigation.replace("Login");
      });
    }, 2000);

    return ()=> clearTimeout(splashTimer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[{transform: [{translateY}]}]}>
      <Image style={styles.img} source={require("../img/backgroundSpl.jpg")}></Image>
      </Animated.View>
      
      <View style={styles.containerLogo}>
        {showImgLogo && (
          <Animated.View style={{transform : [{translateY}]}}>
            <Image style={styles.imgLogo} source={require("../img/logo.png")}></Image>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  img: {
    maxWidth: 360,
    height: 225,
  },
  containerLogo:{
    alignItems: 'center'
  },
  imgLogo: {
    marginTop: 30,
    width: 231,
    height: 40,
  },
});
