import React from "react";

import { Text, TouchableOpacity } from "react-native";
import { app } from "../styles/app";
import { header } from "../styles/components/header";

const showNotifications = () => {};

const Notification = () => (
  <TouchableOpacity onPress={() => showNotifications()} style={header.avatar}>
    <Text style={app.buttonText}>123</Text>
  </TouchableOpacity>
);

export default Notification;
