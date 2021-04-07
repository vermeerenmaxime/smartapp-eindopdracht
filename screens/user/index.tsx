import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Profile from "./Profile";

const Stack = createStackNavigator();

const User = ({ route, navigation }: any) => {
  
  return (
    <Stack.Navigator headerMode="none" initialRouteName="Profile" >
      <Stack.Screen name="Profile" component={Profile} initialParams={route.params}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default User;
