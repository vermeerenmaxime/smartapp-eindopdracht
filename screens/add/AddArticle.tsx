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

const Stack = createStackNavigator();

const AddArticle = ({ route, navigation }: any) => {
  const [visible, setVisible] = useState(false);
  const [overlayImage, setOverlayImage] = useState();

  // const [image, setImage] = useState("");

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
    toggleOverlay();
  };

  const deleteImage = (image: any) => {
    delete storyImages[image];
  };

  const email = route.params.email;
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
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      // setImage(result.uri);
      setStoryImages([...storyImages, result.uri]);
      console.log(storyImages);
    }
  };
  return (
    <SafeAreaView style={app.container}>
      <Header title="Add" props={route.params} />
      {/* <SwitchHeader selected></SwitchHeader> */}
      <KeyboardAvoidingView
        // style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
        behavior="padding"
        enabled
        keyboardVerticalOffset={0}
      >
        <ScrollView style={{ height: "100%" }}>
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
          >
            <Option value={1}>List item 1</Option>
            <Option value={2}>List item 2</Option>
            <Option value={3}>List item 3</Option>
          </Select>
          <SubTitle title="Story" />
          <View style={app.input}>
            <TextInput
              placeholder="Title.."
              style={[story.title]}
              placeholderTextColor={color.gray}
            ></TextInput>
            <TextInput
              placeholder="Write your experience down here.."
              style={{ marginTop: 16 }}
              placeholderTextColor={color.gray}
              multiline={true}
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
            {storyImages.map((image, index) => {
              return (
                <ArticleImage
                  key={index}
                  uri={image}
                  onPress={() => {
                    clickImage(index);
                  }}
                ></ArticleImage>
              );
            })}
            {/* {image && (
              <ArticleImage
                key={5}
                uri={image}
                onPress={() => {
                  clickImage(5);
                }}
              ></ArticleImage>
            )} */}
          </ScrollView>
          <AppButton
            title="Add to story"
            style={{ width: "50%", alignSelf: "flex-end" }}
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
