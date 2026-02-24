import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");

    if (isLoggedIn === "true") {
      setInitialRoute("Success");
    } else {
      setInitialRoute("Phone");
    }
  };

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <StackNavigator initialRouteName={initialRoute} />
    </NavigationContainer>
  );
}