import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Linking,
} from "react-native";
import * as Location from "expo-location";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function SuccessScreen({ route }) {
  const phoneNumber = route?.params?.phoneNumber || "+91 XXXXX XXXXX";

  const [location, setLocation] = useState(null);
  const [safeZones, setSafeZones] = useState([]);

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Location permission denied");
      return;
    }

    const userLocation = await Location.getCurrentPositionAsync({});
    setLocation(userLocation.coords);
    fetchSafeZones(userLocation.coords);
  };

  const fetchSafeZones = async (coords) => {
    try {
      const response = await fetch(
        "https://disha-a-true-saver-in-disaster-scenarios.onrender.com/safe-locations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: coords.latitude,
            longitude: coords.longitude,
          }),
        }
      );

      const data = await response.json();
      setSafeZones(data.locations || []);
    } catch (error) {
      console.log("Safe zone fetch error:", error);
    }
  };

  // Distance calculator (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2);
  };

  // Top 3 nearest hospitals
  const topHospitals = useMemo(() => {
    if (!location) return [];

    return safeZones
      .filter((z) => z.type === "hospital")
      .map((hospital) => ({
        ...hospital,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          hospital.latitude,
          hospital.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
  }, [safeZones, location]);

  const generateMapHTML = () => {
    if (!location) return "";

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <style>
          body { margin:0; padding:0; }
          #map { height:100vh; width:100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${location.latitude}, ${location.longitude}], 14);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
          }).addTo(map);

          var userIcon = L.divIcon({
            html: '<div style="background:#007bff;width:16px;height:16px;border-radius:50%;border:3px solid white;"></div>',
            className: ''
          });

          L.marker([${location.latitude}, ${location.longitude}], { icon: userIcon })
            .addTo(map)
            .bindPopup("You are here");

          var safeZones = ${JSON.stringify(safeZones)};

          safeZones.forEach(zone => {

            var iconColor = "#ff3b30";

            if(zone.type === "hospital") iconColor = "green";
            if(zone.type === "mall") iconColor = "purple";
            if(zone.type === "bunker") iconColor = "orange";

            var customIcon = L.divIcon({
              html: '<div style="background:'+iconColor+';width:18px;height:18px;border-radius:50%;border:3px solid white;"></div>',
              className: ''
            });

            L.marker([zone.latitude, zone.longitude], { icon: customIcon })
              .addTo(map)
              .bindPopup("<b>"+zone.name+"</b><br/>"+zone.type);
          });

        </script>
      </body>
      </html>
    `;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>

        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
          />
          <Text style={styles.phone}>{phoneNumber}</Text>
        </View>

        {/* MAP */}
        {location && (
          <View style={styles.mapContainer}>
            <WebView
              originWhitelist={["*"]}
              source={{ html: generateMapHTML() }}
              style={{ flex: 1 }}
              javaScriptEnabled
              domStorageEnabled
            />
          </View>
        )}

        {/* TOP 3 NEAREST HOSPITALS */}
        {location && topHospitals.length > 0 && (
          <View style={styles.hospitalSection}>
            <Text style={styles.sectionTitle}>
              Top 3 Nearest Hospitals
            </Text>

            {topHospitals.map((hospital, index) => (
              <View key={index} style={styles.hospitalCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.hospitalName}>
                    {hospital.name}
                  </Text>
                  <Text style={styles.hospitalDistance}>
                    {hospital.distance} km away
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.directionBtn}
                  onPress={() =>
                    Linking.openURL(
                      `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`
                    )
                  }
                >
                  <Ionicons name="navigate" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

      </ScrollView>

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
    backgroundColor: "#ffffff",
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

  mapContainer: {
    height: height * 0.65,
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "#eee",
  },

  hospitalSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  hospitalCard: {
    flexDirection: "row",
    backgroundColor: "#f3f3f3",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    alignItems: "center",
  },

  hospitalName: {
    fontWeight: "bold",
    fontSize: 15,
  },

  hospitalDistance: {
    color: "red",
    marginTop: 5,
    fontWeight: "600",
  },

  directionBtn: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 50,
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