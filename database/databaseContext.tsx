import React, { createContext, useContext, useState } from "react";
import StoryModel from "../models/Story";
import UserModel from "../models/User";
import { firestore } from "./firebase";

// const userStories: any = [{}];

// const userStoriesContext = useContext(userStories);

export let userData: UserModel = {
  uid: "",
  displayName: "",
  email: "",
  photoURL: "",
};

export let userFromDatabase: UserModel = {
  uid: "",
  displayName: "",
  email: "",
  photoURL: "",
};

export const setUserData = (data: UserModel) => {
  userData = {
    uid: data.uid,
    displayName: data.displayName,
    email: data.email,
    photoURL: data.photoURL,
  };
  return userData;
};
export const getUserData = () => {
  const userDataFromFirestore: UserModel = firestore
    .collection("user")
    .doc(userData.uid)
    .get();

  userFromDatabase = userDataFromFirestore;

  return userFromDatabase;
};
export const updateUserData = (data: UserModel) => {
  firestore.collection("user").doc(userData.uid).update({
    displayName: data.displayName,
  });
};

export let userStory = [{}];
export const getStories = (storyId: string) => {
  let stories: Array<StoryModel> = [
    {
      author: "",
      description: "",
      image: "",
      likes: "",
      private: true,
      title: "",
    },
  ];

  return stories;
};
export const addStory = (newStory: StoryModel) => {
  if (newStory) {
    userStory.push({
      // uid: data.uid,
      // displayName: data.displayName,
      // email: data.email,
      // photoURL: data.photoURL,
    });
  }
  return userStory;
};
export const editStory = (story: StoryModel) => {
  return userStory;
};
export const deleteStory = (story: StoryModel) => {
  return userStory;
};

// export const getUserData = userData[0];

// export const UserDataContext = createContext(userData);
