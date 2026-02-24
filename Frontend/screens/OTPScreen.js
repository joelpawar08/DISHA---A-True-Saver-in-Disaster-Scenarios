import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { verifyOTP } from "../api";

export default function OTPScreen({ route, navigation }) {
  const { phone } = route.params;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const inputs = useRef([]);

  const handleChange = (text, index) => {
    if (text.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setError("Enter complete 6-digit OTP");
      return;
    }

    const response = await verifyOTP(phone, finalOtp);

    if (response.status === 200) {

      // ✅ Save session
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("userPhone", phone);

      navigation.replace("Success");

    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <View style={styles.container}>

      <Image
        source={require("../assets/lotties/2.png")}
        style={styles.topImage}
      />

      <Text style={styles.title}>Enter OTP</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={styles.otpBox}
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
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
    width: 220,
    height: 220,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 25,
    textAlign: "center",
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  otpBox: {
    width: 50,
    height: 60,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    fontSize: 22,
    textAlign: "center",
  },

  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});