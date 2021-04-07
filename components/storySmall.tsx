import React from "react";

import { Text, TouchableOpacity } from "react-native";
import { app } from "../styles/app";
import { story } from "../styles/components/story";

const showNotifications = () => {};

const StorySmall = ({ title, onPress }: any) => (
  <TouchableOpacity style={story.small} onPress={onPress}>
    <Text style={story.smallText}>{title}</Text>
  </TouchableOpacity>
);

export default StorySmall;
