import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PhoneScreen from "../screens/PhoneScreen";
import OTPScreen from "../screens/OTPScreen";
import SuccessScreen from "../screens/SuccessScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator({ initialRouteName }) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Phone" component={PhoneScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
    </Stack.Navigator>
  );
}