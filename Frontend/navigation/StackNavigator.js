import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import PhoneScreen from "../screens/PhoneScreen";
import OTPScreen from "../screens/OTPScreen";
import SuccessScreen from "../screens/SuccessScreen";
import SOSScreen from "../screens/SOSScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 70,
          borderRadius: 40,
          marginHorizontal: 20,
          marginBottom: 20,
          position: "absolute",
          backgroundColor: "#fff",
          elevation: 10,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => {
          let iconName;
          let size = 24;
          let color = focused ? "red" : "#000";

          if (route.name === "Home") iconName = "home";
          if (route.name === "SOS") {
            iconName = "alert-circle";
            size = 30;
          }
          if (route.name === "AR") iconName = "cube";
          if (route.name === "Settings") iconName = "settings";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={SuccessScreen} />
      <Tab.Screen name="SOS" component={SOSScreen} />

      {/* Dummy Screens */}
      <Tab.Screen
        name="AR"
        component={() => null}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />

      <Tab.Screen
        name="Settings"
        component={() => null}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default function StackNavigator({ initialRouteName }) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Phone" component={PhoneScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}