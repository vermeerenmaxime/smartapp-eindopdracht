import React from "react";

import { Text, View } from "react-native";
import { subtitle } from "../styles/components/subTitle";

const SubTitle = ({ title }: any) => (
  <View style={subtitle.container}>
    <View style={subtitle.stroke}></View>
    <Text style={subtitle.text}>{title}</Text>
  </View>
);

export default SubTitle;
