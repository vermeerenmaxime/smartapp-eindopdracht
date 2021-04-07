import React from "react";

import {
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
  TextInput,
} from "react-native";
import { app } from "../styles/app";

const AppButton = ({ onPress, title, style }: any) => (
  <TouchableOpacity onPress={onPress} style={[app.button, style]}>
    <Text style={app.buttonText}>{title}</Text>
  </TouchableOpacity>
);

export default AppButton;
