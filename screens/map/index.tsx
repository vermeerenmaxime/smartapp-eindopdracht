import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MapOverview from "./MapOverview";

const Stack = createStackNavigator();

const Map = ({ route, navigation }: any) => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="MapOverview">
      <Stack.Screen
        name="MapOverview"
        component={MapOverview}
        initialParams={route.params}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

export default Map;
