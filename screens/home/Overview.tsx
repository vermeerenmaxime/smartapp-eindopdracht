import React, { useEffect, useState, useCallback } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../components/header";
import SubTitle from "../../components/subTitle";

import { app } from "../../styles/app";
import StorySmall from "../../components/storySmall";

const Stack = createStackNavigator();

const Overview = ({ route, navigation }: any) => {
  const email = route.params.email;
  return (
    <SafeAreaView style={app.container}>
      <Header title="Home" props={route.params} />
      <SubTitle title="Trending on Travler" />
      <ScrollView horizontal={true} style={app.scrollViewHorizontal}>
        <StorySmall title="Norway Trip 2021" onPress={() => navigation.navigate("Story", { storyId: 1 })}/>
        <StorySmall title="Norway Trip 2021" onPress={() => navigation.navigate("Story", { storyId: 1 })}/>
        <StorySmall title="Norway Trip 2021" onPress={() => navigation.navigate("Story", { storyId: 1 })}/>
      </ScrollView>
      <SubTitle title="Verified stories" />
      <ScrollView horizontal={true} style={app.scrollViewHorizontal}>
        <StorySmall title="Norway Trip 2021" onPress={() => navigation.navigate("Story", { storyId: 1 })}/>
        <StorySmall title="Norway Trip 2021" onPress={() => navigation.navigate("Story", { storyId: 1 })}/>
        <StorySmall title="Norway Trip 2021" onPress={() => navigation.navigate("Story", { storyId: 1 })}/>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Overview;
