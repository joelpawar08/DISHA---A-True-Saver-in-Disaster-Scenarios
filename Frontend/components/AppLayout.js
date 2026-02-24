import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function AppLayout({ children, phoneNumber }) {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.phone}>{phoneNumber}</Text>
      </View>

      {/* SCREEN CONTENT */}
      <View style={{ flex: 1 }}>
        {children}
      </View>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="home" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="alert-circle" size={30} color="red" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="cube" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="settings" size={24} color="#000" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 10,
  },

  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },

  phone: {
    fontSize: 16,
    fontWeight: "600",
  },

  bottomNav: {
    position: "absolute",
    bottom: 25,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: width * 0.8,
    height: 65,
    backgroundColor: "#ffffff",
    borderRadius: 40,
    elevation: 12,
  },
});