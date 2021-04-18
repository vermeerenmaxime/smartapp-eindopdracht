import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Profile from "./Profile";
// import Story from "./Story";

const Stack = createStackNavigator();

const User = ({ route, navigation }: any) => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={Profile}
        initialParams={route.params}
      ></Stack.Screen>
      {/* <Stack.Screen
        name="Story"
        component={Story}
        initialParams={route.params}
      ></Stack.Screen> */}
    </Stack.Navigator>
  );
};

export default User;
