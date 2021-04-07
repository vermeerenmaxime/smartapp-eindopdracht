import React, { useEffect, useState, useCallback } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import {
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubTitle from "../../components/subTitle";

import { LinearGradient } from "expo-linear-gradient";
import ParallaxScrollView from 'react-native-parallax-scroll-view';

import { app } from "../../styles/app";
import { story } from "../../styles/components/story";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Stack = createStackNavigator();

const Story = ({ route, navigation }: any) => {
  const imageUrl = {
    uri:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F6%2F67%2FGeirangerfjord%252C_Norway_%2528Unsplash%2529.jpg%2F640px-Geirangerfjord%252C_Norway_%2528Unsplash%2529.jpg&f=1&nofb=1",
  };
  const storyId = route.params.storyId;
  return (
    <ScrollView>
      <ImageBackground source={imageUrl} style={[story.image]}>
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
          start={[0.5, 0]}
          style={[story.linearGradient]}
        >
          <View
            style={{
              width: "100%",

              marginBottom: -22,
              zIndex: 2,
              alignItems: "flex-end",
              flexDirection: "row",
              // backgroundColor: "blue",
            }}
          >
            <TouchableOpacity style={story.avatar}>
              <View>
                <Image
                  style={story.avatarImage}
                  source={require("../../assets/favicon.png")}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                marginLeft: 12,
                justifyContent: "space-around",
                flexDirection: "column",
              }}
            >
              <Text style={story.author}>
                written by <Text>Martijn Loth</Text>
              </Text>
              <View style={story.likes}>
                <FontAwesomeIcon
                  icon={faHeart}
                  size={12}
                  style={story.likesIcon}
                />
                <Text style={story.likesText}>22 people liked this story</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={story.like}
            onPress={() => console.log("Like")}
          >
            <FontAwesomeIcon icon={faHeart} size={32} style={story.likeIcon} />
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>

      <View style={app.container}>
        <View>
          <Text style={story.title}>Story #{storyId}</Text>
          <Text>Beschrijving over het verhaal van deze trip</Text>
        </View>
        <SubTitle title="Dag 1"></SubTitle>
        <Text>Coole font met dag1</Text>
        <ScrollView
          horizontal={true}
          style={[story.articleImages, app.scrollViewHorizontal]}
        >
          <TouchableOpacity style={[story.articleImage]}></TouchableOpacity>
          <TouchableOpacity style={[story.articleImage]}></TouchableOpacity>
          <TouchableOpacity style={[story.articleImage]}></TouchableOpacity>
          <TouchableOpacity style={[story.articleImage]}></TouchableOpacity>
          <TouchableOpacity style={[story.articleImage]}></TouchableOpacity>
        </ScrollView>
        <SubTitle title="Dag 2">
          <Text>Coole font met dag2</Text>
          <ScrollView
            horizontal={true}
            style={[story.articleImages, app.scrollViewHorizontal]}
          >
            <TouchableOpacity style={[story.articleImage]}></TouchableOpacity>
            <TouchableOpacity style={[story.articleImage]}></TouchableOpacity>
          </ScrollView>
        </SubTitle>
        <SubTitle title="Dag 3"></SubTitle>
        <SubTitle title="Dag 4"></SubTitle>
      </View>
    </ScrollView>
  );
};

export default Story;
