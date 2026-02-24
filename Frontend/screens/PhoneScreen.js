import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { sendOTP } from "../api";

export default function PhoneScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      Alert.alert("Invalid Number", "Enter valid 10-digit number");
      return;
    }

    try {
      setLoading(true);
      await sendOTP(`+91${phone}`);
      navigation.navigate("OTP", { phone: `+91${phone}` });
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      {/* TOP IMAGE */}
      <Image
        source={require("../assets/lotties/1.png")}
        style={styles.topImage}
      />

      <Text style={styles.title}>Enter your mobile number</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.code}>+91</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={10}
          placeholder="Enter phone number"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSendOTP}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Sending..." : "Continue"}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },

  topImage: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },

  inputContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginBottom: 20,
  },

  code: {
    fontSize: 16,
    marginRight: 8,
    color: "#555",
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});