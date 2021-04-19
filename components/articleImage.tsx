import React from "react";

import {
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
  TextInput,
  ImageBackground,
} from "react-native";
import { app } from "../styles/app";
import { story } from "../styles/components/story";

const ArticleImage = ({ uri, onPress, onLongPress }: any) => (
  <TouchableOpacity
    style={[story.articleImage]}
    onPress={onPress}
    onLongPress={onLongPress}
  >
    <ImageBackground
      source={{
        uri: uri,
      }}
      style={{ width: "100%", height: "100%" }}
    ></ImageBackground>
  </TouchableOpacity>
);

export default ArticleImage;
