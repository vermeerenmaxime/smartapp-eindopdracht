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

const AppButton = ({ onPress, title, style, red }: any) =>
  !red ? (
    <TouchableOpacity onPress={onPress} style={[app.button, style]}>
      <Text style={app.buttonText}>{title}</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={onPress}
      style={[app.button, style, app.buttonRed]}
    >
      <Text style={app.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

export default AppButton;
