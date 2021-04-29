import React, { createContext, useContext, useState } from 'react'
import StoryModel from '../models/Story'
import UserModel from '../models/User'
import { firestore } from './firebase'

// const userStories: any = [{}];

// const userStoriesContext = useContext(userStories);

export let userData: UserModel = {
  uid: '',
  displayName: '',
  email: '',
  photoURL: ''
}

export let userFromDatabase: UserModel = {
  uid: '',
  displayName: '',
  email: '',
  photoURL: ''
}

export const setUserData = (data: UserModel) => {
  userData = {
    uid: data.uid,
    displayName: data.displayName,
    email: data.email,
    photoURL: data.photoURL
  }
  return userData
}
export const getUserData = async () => {
  // let userDataFromFirestore: UserModel = {}

  await firestore
    .collection('user')
    .doc(userData.uid)
    .get()
    .then(doc => {
      userFromDatabase = {
        uid: doc.data()?.uid,
        displayName: doc.data()?.displayName,
        email: doc.data()?.email,
        photoURL: doc.data()?.photoURL
      }
    })

  return userFromDatabase
}
export const updateUserData = (data: UserModel) => {
  firestore
    .collection('user')
    .doc(userData.uid)
    .update({
      displayName: data.displayName
    })
}

export let userStories: StoryModel[] = [
  {
    author: '',
    description: '',
    image: '',
    likes: 0,
    private: true,
    title: ''
  }
]

const storiesRef = firestore.collection('story')
export const getStories = (fromUser: boolean = true) => {
  let stories: StoryModel[] = [
    {
      author: '',
      description: '',
      image: '',
      likes: 0,
      private: true,
      title: ''
    }
  ]

  if (fromUser) {
    userStories = []
    storiesRef
      .where('author', '==', userData.uid)
      .get()
      .then(query => {
        query.forEach(doc => {
          let newStory: StoryModel = {
            id: doc.id,
            title: doc.data().title,
            image: doc.data().image,
            private: doc.data().private,
            author: doc.data().author,
            description: doc.data().description,
            likes: doc.data().likes,
            lat: doc.data().lat,
            long: doc.data().long
          }
          userStories.push(newStory)
        })
      })
      .catch((error: any) => {
        console.log('Error getting documents: ', error)
      })
    return userStories
  } else {
    storiesRef
      .get()
      .then(query => {
        query.forEach(doc => {
          let newStory: StoryModel = {
            id: doc.id,
            title: doc.data().title,
            image: doc.data().image,
            private: doc.data().private,
            author: doc.data().author,
            description: doc.data().description,
            likes: doc.data().likes,
            lat: doc.data().lat,
            long: doc.data().long
          }
          stories.push(newStory)
        })
      })
      .catch((error: any) => {
        console.log('Error getting documents: ', error)
      })
    return stories
  }
}
export const getStory = (storyId: string) => {
  let story: StoryModel = {
    author: '',
    description: '',
    image: '',
    likes: 0,
    private: true,
    title: ''
  }
  return story
}
// s

export const getStoryFromUserLatest = () => {
  let story: StoryModel = {
    author: '',
    description: '',
    image: '',
    likes: 0,
    private: true,
    title: ''
  }

  storiesRef
    .where('author', '==', userData.uid)
    .where('entryTime', '==', userData.uid)
    .get()
    .then(query => {
      query.forEach(doc => {
        let newStory: StoryModel = {
          id: doc.id,
          title: doc.data().title,
          image: doc.data().image,
          private: doc.data().private,
          author: doc.data().author,
          description: doc.data().description,
          likes: doc.data().likes,
          lat: doc.data().lat,
          long: doc.data().long
        }
        userStories.push(newStory)
      })
    })
    .catch((error: any) => {
      console.log('Error getting latest userStory: ', error)
    })
  return story
}
export const addStory = (newStory: StoryModel) => {
  return userStories
}
export const editStory = (story: StoryModel) => {
  return userStories
}
export const deleteStory = (story: StoryModel) => {
  return userStories
}

// export const getUserData = userData[0];

// export const UserDataContext = createContext(userData);
