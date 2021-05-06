import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AddArticle from "../home/AddArticle";
import AddStory from "../home/AddStory";
import Fy from "./Fy";

const Stack = createStackNavigator();

const Add = ({ route, navigation }: any) => {
  return (
    // headerMode="none"
    <Stack.Navigator headerMode="none" initialRouteName="AddStory">
      <Stack.Screen
        name="Fy"
        component={Fy}
        initialParams={route.params}
      ></Stack.Screen>

    </Stack.Navigator>
  );
};

export default Add;
