import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { forwardRef, useCallback, useImperativeHandle } from "react";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const BottomSheet = forwardRef((props, ref) => {
    const {snapTo} = props;
  const { height } = Dimensions.get("screen");
  const closeHeight = height;
  const percentage = parseFloat(snapTo) / 100;
  const openHeight = height - height * percentage;
  const topAnimation = useSharedValue(closeHeight);

  const expand = useCallback(()=>{
    'worklet'
    topAnimation.value = withTiming(openHeight);
  }, [openHeight, topAnimation]);

  const close = useCallback(()=>{
    'worklet'
    topAnimation.value = withTiming(closeHeight);
  }, [openHeight, topAnimation]);

  useImperativeHandle(ref, ()=>({
    expand,
    close,
  }), [expand, close])

  const animationStyle = useAnimatedStyle(()=>{
    const top = topAnimation.value;
    return{
        top,
    }
  })
  return (
    <View style={[styles.conatainer, animationStyle]}>
      <View style={styles.lineContainer}>
        <View style={styles.line} />
      </View>
    </View>
  );
});

export default BottomSheet;

const styles = StyleSheet.create({
  conatainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  lineContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    width: 50,
    height: 4,
    backgroundColor: "black",
    borderRadius: 20,
  },
});
