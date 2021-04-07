import React, { useEffect, useState, useCallback } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import {
  Switch,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../components/header";
import SubTitle from "../../components/subTitle";

import { app } from "../../styles/app";
import { color } from "../../styles/colors";
import SwitchHeader from "../../components/switchHeader";
import { switchHeader } from "../../styles/components/switchHeader";

const Stack = createStackNavigator();

const NewStory = ({ route, navigation }: any) => {
  const email = route.params.email;
  const [enabled, setEnabled] = useState(false);
  const toggleSwitch = () => {
    if (enabled) setEnabled(false);
    else setEnabled(true);
  };
  return (
    <SafeAreaView style={app.container}>
      <Header title="Create" props={route.params} />
      {/* <SwitchHeader></SwitchHeader> */}
      <View style={switchHeader.header}>
        <TouchableOpacity
          style={switchHeader.itemContainer}
          onPress={() => navigation.navigate("AddArticle")}
        >
          <Text style={switchHeader.itemText}>Add to existing</Text>
        </TouchableOpacity>
        <TouchableOpacity style={switchHeader.itemContainer}>
          <Text style={switchHeader.itemText}>Create new story</Text>
          <View style={switchHeader.selected}></View>
        </TouchableOpacity>
      </View>
      <SubTitle title="Name trip" />
      <SubTitle title="Description" />
      <SubTitle title="Add picture" />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text>Private trip</Text>
        <Switch
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={enabled}
        />
      </View>
    </SafeAreaView>
  );
};

export default NewStory;
