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
  ActivityIndicator,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubTitle from "../../components/subTitle";

import { LinearGradient } from "expo-linear-gradient";

import { app } from "../../styles/app";
import { story } from "../../styles/components/story";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHeart,
  faPencilAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { firebase, firestore } from "../../database/firebase";
import { useFocusEffect } from "@react-navigation/native";

import StoryModel from "../../models/Story";
import ArticleModel from "../../models/Article";
import UserModel from "../../models/User";
import AppButton from "../../components/appButton";
import { Overlay } from "react-native-elements";

import { userData } from "../../database/databaseContext";

const Story = ({ route, navigation, user }: any) => {
  const imageUrl = {
    uri:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F6%2F67%2FGeirangerfjord%252C_Norway_%2528Unsplash%2529.jpg%2F640px-Geirangerfjord%252C_Norway_%2528Unsplash%2529.jpg&f=1&nofb=1",
  };
  const storyId = route.params.storyId;

  const [storyData, setStoryData] = useState<StoryModel>({
    author: "",
    description: "",
    image: "",
    likes: "",
    private: true,
    title: "",
  });
  const [storyArticles, setStoryArticles] = useState<ArticleModel[]>([]);
  // const [storyAuthor, setStoryAuthor] = useState<UserModel>([]);
  const [overlayStoryEditVisible, setOverlayStoryEditVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleStoryEditOverlay = () => {
    setOverlayStoryEditVisible(!overlayStoryEditVisible);
    // setoverlayImage(image);
  };

  const getStory = (storyId: string) => {
    setLoading(true);
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
    getStoryArticles(storyId);
    setLoading(false);
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
  const deleteStoryImage = () => {
    let pictureRef = firebase.storage().refFromURL(`${storyData?.image}`);

    pictureRef
      .delete()
      .then(() => {
        console.log("-- Story picture removed from firebase storage");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteStory = () => {
    setLoading(true);
    deleteStoryImage();

    firestore
      .collection("story")
      .doc(storyId)
      .delete()
      .then(() => {
        console.log("-- Story removed from firestore database");
        navigation.navigate("Profile");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
    setLoading(false);
  };
  const changeStoryImage = () => {};

  const [storyPrivate, setStoryPrivate] = useState(false);

  const toggleSwitch = () => {
    if (storyPrivate) {
      setStoryPrivate(false);
    } else {
      setStoryPrivate(true);
    }
  };

  const Published = () => {
    if (userData.uid === storyData?.author) {
      return (
        <View
          style={{
            marginVertical: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>Publish trip</Text>
          <Switch
            ios_backgroundColor="#3e3e3e"
            // onValueChange={toggleSwitch}
            onValueChange={(published: boolean) => {
              setStoryData((oldStory: StoryModel) => {
                oldStory.private = published;
                return { ...oldStory };
              });
            }}
            value={storyData?.private}
          />
        </View>
      );
    } else {
      return null;
    }
  };

  useFocusEffect(
    useCallback(() => {
      getStory(storyId);
    }, [])
  );
  if (loading) return <ActivityIndicator></ActivityIndicator>;
  else {
    return (
      <ScrollView>
        <ImageBackground
          source={{ uri: storyData?.image }}
          style={[story.image]}
        >
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
                    {storyData?.likes} people liked this trip
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
          {route.params.edit ? (
            <AppButton
              style={{ marginTop: 16 }}
              title="Add article"
              onPress={() => {
                navigation.navigate("Add", {
                  screen: "AddStory",
                  params: {
                    storyId: storyId,
                  },
                });
              }}
            ></AppButton>
          ) : null}
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

          {}
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
                onChangeText={(text: string) => {
                  setStoryData((oldStory: StoryModel) => {
                    oldStory.title = text;
                    return { ...oldStory };
                  });
                }}
                value={storyData?.title}
                placeholder="Story title.."
              />
              <TextInput
                style={[app.input, { minHeight: 100, paddingTop: 16 }]}
                onChangeText={(text: string) => {
                  setStoryData((oldStory: StoryModel) => {
                    oldStory.description = text;
                    return { ...oldStory };
                  });
                }}
                value={storyData?.description}
                placeholder="Story description.."
                multiline={true}
              />
              <Published />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <AppButton
                  onPress={() => deleteStory()}
                  red
                  title={
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      size={18}
                      style={{ color: "white" }}
                    />
                  }
                  style={{ width: "20%" }}
                />
                <AppButton
                  onPress={() => updateStory()}
                  title="Save changes"
                  style={{ width: "75%" }}
                />
              </View>
            </View>
          </Overlay>
        ) : null}
      </ScrollView>
    );
  }
};

export default Story;
