import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import AppLayout from "../components/AppLayout";

export default function SOSScreen() {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [loading, setLoading] = useState(false);
  const [policeStations, setPoliceStations] = useState([]);

  // 🔴 Pulsing Animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // 🚨 Trigger SOS
  const triggerSOS = async () => {
    try {
      setLoading(true);

      // 1️⃣ Get Location Permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        return;
      }

      // 2️⃣ Get Current Location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // 3️⃣ Call Backend SOS API
      const response = await fetch("https://disha-a-true-saver-in-disaster-scenarios.onrender.com/safe-locations/sos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude,
          longitude,
          emergency_contact: "+919XXXXXXXXX", // Replace dynamically later
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "SOS Failed");
      }

      setPoliceStations(data.details.police_stations);

      Alert.alert("SOS Sent 🚨", "Emergency contact has been notified.");

    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>

      <ScrollView contentContainerStyle={styles.container}>

        {/* 🔴 Animated SOS Button */}
        <Animated.View
          style={[
            styles.sosWrapper,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <TouchableOpacity style={styles.sosButton} onPress={triggerSOS}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.sosText}>SOS</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* 🚔 Show Police Stations */}
        {policeStations.length > 0 && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>
              Nearest Police Stations
            </Text>

            {policeStations.map((station, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.stationName}>
                  {station.name}
                </Text>
                <Text>
                  📍 {station.latitude}, {station.longitude}
                </Text>
                <Text>
                  📞 {station.contact}
                </Text>
              </View>
            ))}
          </View>
        )}

      </ScrollView>

    </AppLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 40,
  },

  sosWrapper: {
    marginTop: 20,
  },

  sosButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#ff1a1a",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#ff0000",
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },

  sosText: {
    color: "#fff",
    fontSize: 48,
    fontWeight: "bold",
    letterSpacing: 2,
  },

  resultContainer: {
    marginTop: 40,
    width: "90%",
  },

  resultTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },

  stationName: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
});