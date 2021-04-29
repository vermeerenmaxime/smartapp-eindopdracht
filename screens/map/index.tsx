import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MapOverview from "./MapOverview";
import Story from "../home/Story";

const Stack = createStackNavigator();

const Map = ({ route, navigation }: any) => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="MapOverview">
      <Stack.Screen
        name="MapOverview"
        component={MapOverview}
        initialParams={route.params}
      ></Stack.Screen>
      <Stack.Screen
        name="Story"
        component={Story}
        initialParams={route.params}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

export default Map;
