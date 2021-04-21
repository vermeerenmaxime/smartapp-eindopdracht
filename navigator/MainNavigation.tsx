import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// @ts-ignore
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

import Home from "../screens/home";
import User from "../screens/user";
import Add from "../screens/add";
import Map from "../screens/map";

import { color } from "../styles/colors";

import { navigationBottom } from "../styles/components/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { faHome } from "@fortawesome/free-solid-svg-icons";
import { firebase, firestore } from "../database/firebase";
import UserModule from "../models/User";

function Fy({}) {
  return <Text>fy</Text>;
}
// function Map({}) {
//   return <Text>fy</Text>;
// }

function CustomTabBar({ navigation, state, position }: any) {
  return (
    <View style={navigationBottom.TabBarMainContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Overview")}
        activeOpacity={0.6}
        style={navigationBottom.button}
      >
        <Ionicons name="book" size={12} color="white" />
        <Text style={navigationBottom.TextStyle}>home </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // onPress={() => {navigation.navigate("Fy")}}
        onPress={() => console.log("test")}
        activeOpacity={0.6}
        style={navigationBottom.button}
      >
        <Ionicons name="globe" size="12" color="white" />
        <Text style={navigationBottom.TextStyle}>fy</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("TabNavigation", { screen: "Add" })}
        activeOpacity={0.6}
        style={navigationBottom.buttonAdd}
      >
        <Text style={navigationBottom.buttonAddTextStyle}> + </Text>
      </TouchableOpacity>

      {/*
      <TouchableOpacity
        onPress={props.navigation.navigate("TabNavigation", { screen: "Map" })}
        activeOpacity={0.6}
        style={styles.button}
      >
        <Ionicons name="compass" size="12" color="white" />

        <Text style={styles.TextStyle}>map</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={props.navigation.navigate("TabNavigation", { screen: "User" })}
        activeOpacity={0.6}
        style={styles.button}
      >
        <Text style={styles.TextStyle}>me</Text>
      </TouchableOpacity> */}
    </View>
  );
}

export default function MainNavigation({ route, navigation }: any) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<UserModule>({
    uid: "",
    displayName: "",
    email: "",
    photoURL: "",
  });

  const onAuthStateChanged = (user: any) => {
    setUser(user);
    route.params.user = user;
    if (initializing) setInitializing(false);
    // console.log(route.params);
  };

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;
  else {
    if (!user) {
      return navigation.navigate("Login");
    } else {
      return (
        <Tab.Navigator
          // tabBar={(props) => <CustomTabBar {...props} />}
          // screenOptions={customTabOptions}
          tabBarOptions={{
            inactiveTintColor: "white",
            activeTintColor: "#59D999",

            tabStyle: {},
            safeAreaInsets: {
              //bottom:0
            },
            style: {
              borderTopWidth: 0,
              backgroundColor: "#312F2F",
            },
            labelStyle: {
              fontSize: 16,
              fontWeight: "bold",
            },
          }}
        >
          <Tab.Screen
            name="home"
            component={Home}
            initialParams={route.params}
            // options={{
            //   title: "",

            //   tabBarIcon: ({ size, focused }) => {
            //     return (
            //       <FontAwesomeIcon
            //         icon={faHome}
            //         style={{ color: color.alpha }}
            //         size={16}
            //       ></FontAwesomeIcon>
            //     );
            //   },
            // }}
          />
          <Tab.Screen name="fy" component={Fy} />
          <Tab.Screen name="+" component={Add} initialParams={route.params} />
          <Tab.Screen name="map" component={Map} initialParams={route.params} />
          <Tab.Screen
            name="user"
            component={User}
            initialParams={route.params}
          />
        </Tab.Navigator>
      );
    }
  }
}
