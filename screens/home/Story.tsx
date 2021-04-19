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
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubTitle from "../../components/subTitle";

import { LinearGradient } from "expo-linear-gradient";
import ParallaxScrollView from "react-native-parallax-scroll-view";

import { app } from "../../styles/app";
import { story } from "../../styles/components/story";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHeart, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { firebase, firestore } from "../../database/firebase";
import { useFocusEffect } from "@react-navigation/native";

import StoryModel from "../../models/Story";
import ArticleModel from "../../models/Article";
import AppButton from "../../components/appButton";
import { Overlay } from "react-native-elements";

const Stack = createStackNavigator();

const Story = ({ route, navigation }: any) => {
  const imageUrl = {
    uri:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F6%2F67%2FGeirangerfjord%252C_Norway_%2528Unsplash%2529.jpg%2F640px-Geirangerfjord%252C_Norway_%2528Unsplash%2529.jpg&f=1&nofb=1",
  };
  const storyId = route.params.storyId;

  const [storyData, setStoryData] = useState<StoryModel>();
  const [storyArticles, setStoryArticles] = useState<ArticleModel[]>([]);
  const [storyAuthor, setStoryAuthor] = useState([]);
  const [overlayStoryEditVisible, setOverlayStoryEditVisible] = useState(false);

  const toggleStoryEditOverlay = () => {
    setOverlayStoryEditVisible(!overlayStoryEditVisible);
    // setoverlayImage(image);
  };

  const getStory = (storyId: string) => {
    let storiesRef = firestore.collection("story");

    storiesRef
      .doc(storyId)
      .get()
      .then((doc) => {
        let getStoryData: any = doc.data();

        setStoryData(getStoryData);

        console.log("Story", storyData);
      })
      .catch((error: any) => {
        console.log("Error getting documents: ", error);
      });
  };
  const getStoryArticles = (storyId: string) => {
    let storiesRef = firestore.collection("article");
    storiesRef
      .where("storyId", "==", storyId)
      .get()
      .then((query) => {
        let articles: any = [];
        query.forEach((doc) => {
          let newArticle = {
            id: doc.id,
            title: doc.data().title,
            // image: doc.data().image,
            note: doc.data().note,
          };

          articles.push(newArticle);
        });
        setStoryArticles(articles);
      })
      .catch((error: any) => {
        console.log("Error getting documents: ", error);
      });
  };

  const getStoryAuthor = (storyId, author) => {
    // TODO !
  };

  const updateStory = () => {};
  const changeStoryImage = () => {};

  useFocusEffect(
    useCallback(() => {
      getStory(storyId);
      getStoryArticles(storyId);
    }, [])
  );
  return (
    <ScrollView>
      <ImageBackground source={{ uri: storyData?.image }} style={[story.image]}>
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
                <Text style={story.likesText}>
                  {storyData?.likes} people liked this story
                </Text>
              </View>
            </View>
          </View>
          {route.params.edit ? (
            <TouchableOpacity
              style={story.like}
              onPress={() => toggleStoryEditOverlay()}
            >
              <FontAwesomeIcon
                icon={faPencilAlt}
                size={18}
                style={story.likeIcon}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={story.like}
              onPress={() => console.log("Like")}
            >
              <FontAwesomeIcon
                icon={faHeart}
                size={32}
                style={story.likeIcon}
              />
            </TouchableOpacity>
          )}
        </LinearGradient>
      </ImageBackground>

      <View style={[app.container, { marginTop: 32 }]}>
        <View>
          <Text style={story.title}>{storyData?.title}</Text>
          <Text>{storyData?.description}</Text>
        </View>
        {storyArticles ? (
          storyArticles.map((article, index) => {
            return (
              <View key={index}>
                {route.params.edit ? (
                  <SubTitle
                    title={article.title}
                    edit
                    onPress={() => {
                      navigation.navigate("EditArticle", {
                        storyTitle: storyData?.title,
                        articleId: article.id,
                      });
                    }}
                  ></SubTitle>
                ) : (
                  <SubTitle title={article.title}></SubTitle>
                )}

                <Text>{article.note}</Text>
                <ScrollView
                  horizontal={true}
                  style={[story.articleImages, app.scrollViewHorizontal]}
                >
                  <TouchableOpacity
                    style={[story.articleImage]}
                  ></TouchableOpacity>
                </ScrollView>
              </View>
            );
          })
        ) : (
          <View>
            <Text>Deze trip heeft nog geen artikels</Text>
          </View>
        )}
      </View>
      {route.params.edit ? (
        <Overlay
          isVisible={overlayStoryEditVisible}
          onBackdropPress={toggleStoryEditOverlay}
          overlayStyle={{
            width: "80%",

            padding: 0,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <TouchableOpacity onPress={() => changeStoryImage()}>
            <Image
              source={{ uri: storyData?.image }}
              style={{
                alignSelf: "center",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                width: "100%",
                height: 150,
                shadowColor: "black",
                shadowOpacity: 0.06,
                shadowRadius: 25,
                backgroundColor: "red",
              }}
            ></Image>
          </TouchableOpacity>
          <View style={{ padding: 16 }}>
            <SubTitle title="Edit trip"></SubTitle>
            <TextInput
              style={app.input}
              // onChangeText={setStoryTitle}
              value={storyData?.title}
              placeholder="Story title.."
            />
            <TextInput
              style={[app.input, { minHeight: 100, paddingTop: 16 }]}
              // onChangeText={setStoryDescription}
              value={storyData?.description}
              placeholder="Story description.."
              multiline={true}
            />
            <AppButton onPress={() => updateStory()} title="Edit trip" />
          </View>
        </Overlay>
      ) : null}
    </ScrollView>
  );
};

export default Story;
