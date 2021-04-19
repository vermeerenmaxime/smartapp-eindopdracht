import { firebase, firestore } from "../database/firebase";

// import firebase from "firebase";
import React, { useState } from "react";

import { Text, TouchableOpacity, View, Image, TextInput } from "react-native";
import { Button, Overlay } from "react-native-elements";
import { app } from "../styles/app";

import { header } from "../styles/components/header";
import AppButton from "./appButton";
import SubTitle from "./subTitle";

const Header = ({ title, subTitle, props }: any) => {
  const [displayName, setDisplayName] = useState(props.user.displayName);
  const [email, setEmail] = useState("");
  const [overlayVisible, setOverlayVisible] = useState(false);

  const updateUser = () => {
    console.log("update", props.user.uid);
    firestore.collection("user").doc(props.user.uid).update({
      displayName: displayName,
    });
  };

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
    // setoverlayImage(image);
  };

  const showNotifications = () => {
    toggleOverlay();
    // console.log(props.user.photoURL);
  };

  const changeProfilePicture = () => {};

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
                  : "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fstartyoungfinancial.com%2Fwp-content%2Fuploads%2F2015%2F05%2Fdefault-image.png&f=1&nofb=1",
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
      <Overlay
        isVisible={overlayVisible}
        onBackdropPress={toggleOverlay}
        overlayStyle={{
          width: "70%",

          padding: 16,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <TouchableOpacity onPress={() => changeProfilePicture()}>
          <Image
            source={{ uri: props.user.photoURL }}
            style={{
              alignSelf: "center",
              borderRadius: 100,
              width: 128,
              height: 128,
              marginVertical: 8,
              shadowColor: "black",
              shadowOpacity: 0.06,
              shadowRadius: 25,
              backgroundColor: "red",
            }}
          ></Image>
        </TouchableOpacity>
        <SubTitle title="Profile settings"></SubTitle>
        <TextInput
          style={app.input}
          onChangeText={setDisplayName}
          value={displayName}
          placeholder="Username.."
        />
        <TextInput
          style={app.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email.."
        />
        <AppButton onPress={() => updateUser()} title="Update" />
      </Overlay>
    </View>
  );
};

export default Header;
