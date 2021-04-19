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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubTitle from "../../components/subTitle";

import { app } from "../../styles/app";
import { story } from "../../styles/components/story";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHeart, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { firebase, firestore } from "../../database/firebase";
import { useFocusEffect } from "@react-navigation/native";

import StoryModel from "../../models/Story";
import ArticleModel from "../../models/Article";
import { color } from "../../styles/colors";
import AppButton from "../../components/appButton";
import { header } from "../../styles/components/header";

const Stack = createStackNavigator();

const EditArticle = ({ route, navigation }: any) => {
  const imageUrl = {
    uri:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F6%2F67%2FGeirangerfjord%252C_Norway_%2528Unsplash%2529.jpg%2F640px-Geirangerfjord%252C_Norway_%2528Unsplash%2529.jpg&f=1&nofb=1",
  };
  const articleId = route.params.articleId;
  const storyTitle = route.params.storyTitle;

  const [articleData, setArticleData] = useState<ArticleModel>();

  const [articleTitle, setArticleTitle] = useState(articleData?.title);
  const [articleNote, setArticleNote] = useState(articleData?.note);
  const [articleImages, setArticleImages] = useState("");
  const [loading, setLoading] = useState(true);

  const getArticle = (articleId: string) => {
    let articleRef = firestore.collection("article");

    articleRef
      .doc(articleId)
      .get()
      .then((doc) => {
        let getArticleData: any = doc.data();

        setArticleData(getArticleData);

        console.log("Article", articleData);
        setArticleTitle(articleData?.title);
        setArticleNote(articleData?.note);
        setLoading(false);
      })
      .catch((error: any) => {
        console.log("Error getting documents: ", error);
      });
  };

  const updateArticle = () => {};

  useFocusEffect(
    useCallback(() => {
      getArticle(articleId);
    }, [])
  );
  if (loading) {
    return <ActivityIndicator></ActivityIndicator>;
  } else {
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={[app.container, { marginTop: 32 }]}>
            <Text style={[header.title, { fontSize: 32 }]}>{storyTitle}</Text>
            <SubTitle title="Edit article" />
            <View style={app.input}>
              <TextInput
                placeholder="Title.."
                style={[story.title]}
                placeholderTextColor={color.gray}
                onChangeText={setArticleTitle}
                value={articleTitle}
              ></TextInput>
              <TextInput
                placeholder="Write your experience down here.."
                style={{ marginTop: 16 }}
                placeholderTextColor={color.gray}
                multiline={true}
                onChangeText={setArticleNote}
                value={articleNote}
              ></TextInput>
            </View>

            <ScrollView
              horizontal={true}
              style={[story.articleImages, app.scrollViewHorizontal]}
            >
              <TouchableOpacity style={[story.articleImage]}></TouchableOpacity>
            </ScrollView>
            <AppButton onPress={() => updateArticle()} title="Edit article" />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
};

export default EditArticle;
