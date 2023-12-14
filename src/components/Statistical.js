import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { PieChart } from "react-native-chart-kit";
import AxiosIntance from "../util/AxiosIntance";

const Statistical = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchDataStatistic();
  }, []);

  const fetchDataStatistic = async () => {
    try {
      const response = await AxiosIntance().get("statistic/popular-services");
      setData(response);
    } catch (error) {
      console.log(data);
    }
  };

  const getRandomColor = () => {
    const color = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
    return color !== "#ffffff" ? color : getRandomColor(); // Recursively call the function if the color is white
  };

  return (
    <View style={styles.container}>
      {data.length > 0 && (
        <PieChart
          data={data.map((item) => ({
            name: item.name,
            count: item.count,
            color: getRandomColor(),
          }))}
          width={400}
          height={250}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      )}
    </View>
  );
};

export default Statistical;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
});
