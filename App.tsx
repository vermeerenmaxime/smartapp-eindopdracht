import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { useFonts } from "expo-font";

import TabNavigation from "./navigator/MainNavigation";
import Overview from "./screens/home/Overview";
import Login from "./screens/welcome/Login";
import Register from "./screens/welcome/Register";

const Stack = createStackNavigator();

export default function App() {
  const [loaded, error] = useFonts({
    Roboto: require("./assets/fonts/roboto/Roboto-Regular.ttf"),
    RobotoBold: require("./assets/fonts/roboto/Roboto-Bold.ttf"),
    RobotoMedium: require("./assets/fonts/roboto/Roboto-Medium.ttf"),
  });

  const [userLoggedIn] = useState(false);
  if (loaded) {
    if (userLoggedIn) {
      <NavigationContainer>
        <TabNavigation></TabNavigation>
      </NavigationContainer>;
    } else {
      return (
        <NavigationContainer>
          {/* LoginNav */}
          <Stack.Navigator headerMode="none">
            <Stack.Screen
              name="Login"
              component={Login}
              initialParams={{ userLoggedIn: false }}
            />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="TabNavigation" component={TabNavigation} />
          </Stack.Navigator>
          {/* <TabNavigation></TabNavigation> */}
        </NavigationContainer>
      );
    }
  } else {
    return <ActivityIndicator />;
  }
}
