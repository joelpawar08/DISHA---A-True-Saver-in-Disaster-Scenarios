import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SuccessScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Auth Done ✅</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
  },
});