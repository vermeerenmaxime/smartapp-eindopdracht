import React, { useEffect, useState, useCallback } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Image,
  KeyboardAvoidingView,
  SkewXTransform,
  Platform,
} from "react-native";

import { Select, Option } from "react-native-select-lists";
// https://www.npmjs.com/package/react-native-lists-select

// ! FIREBASE FILE UPLOAD
// https://www.youtube.com/watch?v=GEtqS9Qozv4
// https://www.pluralsight.com/guides/upload-images-to-firebase-storage-in-react-native

import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";

import { Button, Overlay } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../components/header";
import SubTitle from "../../components/subTitle";
import ArticleImage from "../../components/articleImage";

import { app } from "../../styles/app";
import { color } from "../../styles/colors";
import SwitchHeader from "../../components/switchHeader";
import { switchHeader } from "../../styles/components/switchHeader";
import AppButton from "../../components/appButton";
import { story } from "../../styles/components/story";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { firestore } from "../../database/firebase";

const Stack = createStackNavigator();

const AddArticle = ({ route, navigation }: any) => {
  const [visible, setVisible] = useState(false);
  const [overlayImage, setOverlayImage] = useState("");
  const [userStories, setUserStories] = useState([""]);
  // let userStories = [{ id: 1, title: "hi" }];

  const [articleStory, setArticleStory] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [articleNote, setArticleNote] = useState("");

  // const [story, setStory] = useState<Story[]>([]);

  const toggleOverlay = () => {
    setVisible(!visible);
    // setoverlayImage(image);
  };

  const [storyImages, setStoryImages] = useState([
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F6%2F67%2FGeirangerfjord%252C_Norway_%2528Unsplash%2529.jpg%2F640px-Geirangerfjord%252C_Norway_%2528Unsplash%2529.jpg&f=1&nofb=1",
    "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fcdn-image.travelandleisure.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2F1600x1000%2Fpublic%2F1509382317%2Flofoten-islands-norway-aurora-borealis-northern-lights-NORWAYLIGHTS1017.jpg%3Fitok%3Dhk8qG4bN&f=1&nofb=1",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia2.trover.com%2FT%2F55a9b58f198e44046000020a%2Ffixedw_large_4x.jpg&f=1&nofb=1",
  ]);

  const clickImage = (image: any) => {
    setOverlayImage(image);
    toggleOverlay();
  };

  const deleteImage = (image: any) => {
    delete storyImages[image];
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
    setUserStories([]);
    getUserStories();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setStoryImages([...storyImages, result.uri]);
      console.log(storyImages);
    }
  };

  // Old method
  // const getUserStories = () => {
  //   var storiesRef = firestore.collection("story");

  //   storiesRef
  //     .where("author", "==", route.params.user.uid)
  //     .get()
  //     //@ts-ignore
  //     .then((querySnapshot) => {
  //       querySnapshot.forEach((doc) => {
  //         console.log(doc.id, " => ", doc.data().title);

  //         let obj = {
  //           id: doc.id,
  //           title: doc.data().title,
  //         };

  //         setUserStories((userStories) => [
  //           ...userStories,
  //           [doc.id, doc.data().title],
  //         ]);

  //         // console.log(userStories);
  //       });
  //     })
  //     .catch((error: any) => {
  //       console.log("Error getting documents: ", error);
  //     });
  // };

  const getUserStories = () => {
    var storiesRef = firestore.collection("story");

    storiesRef
      .where("author", "==", route.params.user.uid)
      .get()
      .then((query) => {
        let stories: any[] = [];

        query.forEach((doc) => {
          let newStory = {
            id: doc.id,
            title: doc.data().title,
            image: doc.data().image,
          };

          stories.push(newStory);

          // ! Dit zorgt ervoor dat ik maar 1 item te zien krijg ipv mijn hele lijst, vandaar de stories.push
          // setUserStories([...userStories, newStory]);
        });
        setUserStories(stories);
      })
      .catch((error: any) => {
        console.log("Error getting documents: ", error);
      });
  };

  const addArticle = () => {
    console.log("woop");
    let imageName = `article-${route.params.user.uid}-${new Date().getTime()}`;
    // await uploadImage(storyImage, imageName)
    //   .then(async () => {
    //     await getImageFromUpload(imageName);
    //   })
    //   .catch((error) => {
    //     Alert.alert(error);
    //   });

    firestore
      .collection("article")
      .add({
        storyId: articleStory,
        title: articleTitle,
        note: articleNote,
        images: ["hi", "oops"],
      })
      .then(() => {
        console.log(articleStory, "Article succesfully added!");
        // navigation.navigate("Story", { storyId: 1 });
      })
      .catch((error) => {
        console.error("Error adding article: ", error);
      });
  };
  return (
    <SafeAreaView>
      <View style={app.container}>
        <Header title="Add" props={route.params} />
        {/* <SwitchHeader selected></SwitchHeader> */}

        <View style={switchHeader.header}>
          <TouchableOpacity style={switchHeader.itemContainer}>
            <Text style={switchHeader.itemText}>Add to existing</Text>
            <View style={switchHeader.selected}></View>
          </TouchableOpacity>
          <TouchableOpacity
            style={switchHeader.itemContainer}
            onPress={() => navigation.navigate("NewStory")}
          >
            <Text style={switchHeader.itemText}>Create new story</Text>
          </TouchableOpacity>
        </View>
      </View>
      <KeyboardAvoidingView
        // style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
        behavior="padding"
        enabled
        keyboardVerticalOffset={0}
      >
        <ScrollView style={app.container}>
          {/* <Buttontggo></Buttontggo> */}

          <SubTitle title="Select trip" />
          {/* <TextInput
            style={app.input}
            // onChangeText={}
            // value={"Hello"}
            placeholder="Trip.."
            placeholderTextColor={color.gray}
          /> */}
          <Select
            selectTextStyle={{
              fontSize: 16,
              // paddingVertical: 16,
              paddingHorizontal: 8,
            }}
            selectStyle={[
              {
                overflow: "hidden",
                padding: 0,
                margin: 0,
                backgroundColor: "white",

                borderRadius: 12,
                height: 48,
              },
            ]}
            listStyle={{
              backgroundColor: color.light,
              borderColor: color.alpha,
              borderWidth: 2,
              shadowOpacity: 0.05,
              elevation: 50,
              shadowRadius: 50,
              borderRadius: 8,
            }}
            placeholder="Choose your trip"
            onChange={setArticleStory}
            value={articleStory}
          >
            {userStories ? (
              userStories.map((array, index) => {
                return (
                  <Option
                    key={index}
                    value={array[0]}
                    last={true}
                    onPress={() => setArticleStory(array[0])}
                  >
                    {array[1]}
                  </Option>
                );
              })
            ) : (
              <Option value={1}>No stories available</Option>
            )}
          </Select>
          <SubTitle title="Story" />
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
          <SubTitle title="Add pictures" />

          <ScrollView
            horizontal={true}
            style={[story.articleImages, app.scrollViewHorizontal]}
          >
            <TouchableOpacity
              style={[story.articleImage, { backgroundColor: "white" }]}
              onPress={pickImage}
            >
              <FontAwesomeIcon
                icon={faPlus}
                size={24}
                color={color.lightGray}
              />
            </TouchableOpacity>
            {storyImages
              ? storyImages.map((image, index) => {
                  return (
                    <ArticleImage
                      key={index}
                      uri={image}
                      onPress={() => {
                        clickImage(image);
                      }}
                    ></ArticleImage>
                  );
                })
              : null}
          </ScrollView>
          <AppButton
            title="Add to story"
            style={{
              width: "50%",
              alignSelf: "flex-end",
              marginTop: 16,
              marginBottom: 200,
            }}
            onPress={() => addArticle()}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={{
          width: "90%",

          padding: 0,
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: overlayImage }}
          style={{
            width: "100%",
            height: 500,
          }}
          resizeMode="cover"
        ></Image>
      </Overlay>
    </SafeAreaView>
  );
};

export default AddArticle;
