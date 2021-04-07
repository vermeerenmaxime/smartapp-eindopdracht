import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AddArticle from "./AddArticle";
import NewStory from "./NewStory";

const Stack = createStackNavigator();

const Add = ({ route, navigation }: any) => {
  return (
    // headerMode="none"
    <Stack.Navigator headerMode="none" initialRouteName="NewStory">
      <Stack.Screen
        name="AddArticle"
        component={AddArticle}
        initialParams={route.params}
      ></Stack.Screen>
      <Stack.Screen
        name="NewStory"
        component={NewStory}
        initialParams={route.params}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

export default Add;
