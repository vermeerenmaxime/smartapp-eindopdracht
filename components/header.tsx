// import { firebase } from "../database/firebase";

import firebase from "firebase";
import React from "react";

import { Text, TouchableOpacity, View, Image } from "react-native";

import { header } from "../styles/components/header";

const Header = ({ title, subTitle, props }: any) => {
  const showNotifications = () => {};
  {
    console.log(props.user.photoURL);
  }
  return (
    <View style={header.container}>
      <View>
        <Text>{subTitle ? subTitle : "Welcome back,"}</Text>
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
              // source={require("../assets/favicon.png")}

              source={{
                uri: props.user.photoURL
                  ? props.user.photoURL
                  : "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.pngitem.com%2Fpimgs%2Fm%2F52-526033_unknown-person-icon-png-transparent-png.png&f=1&nofb=1",
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
