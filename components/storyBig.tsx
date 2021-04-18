import { LinearGradient } from "expo-linear-gradient";
import React from "react";

import { Text, TouchableOpacity, ImageBackground } from "react-native";
import { app } from "../styles/app";
import { story } from "../styles/components/story";

const StoryBig = ({ title, onPress, image }: any) => (
  <TouchableOpacity style={story.big} onPress={onPress}>
    <ImageBackground
      source={{ uri: image }}
      style={{ width: "100%", height: "100%" }}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
        start={[0.5, 0]}
        style={[story.linearGradient]}
      >
        <Text style={story.bigText}>{title}</Text>
      </LinearGradient>
    </ImageBackground>
  </TouchableOpacity>
);

export default StoryBig;
