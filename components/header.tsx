import React from "react";

import { Text, TouchableOpacity, View, Image } from "react-native";

import { header } from "../styles/components/header";

const Header = ({ title, props }: any) => {
  const showNotifications = () => {};
  return (
    <View style={header.container}>
      <View>
        <Text>Welcome back, {props.email}</Text>
        <Text style={header.title}>{title}</Text>
      </View>
      <View>
        <TouchableOpacity
          onPress={() => showNotifications()}
          style={header.avatar}
        >
          <View style={header.notificationCircle}>
            <Text style={header.notificationCircleText}>1</Text>
          </View>
          <View>
            <Image
              style={header.avatarImage}
              source={require("../assets/favicon.png")}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
