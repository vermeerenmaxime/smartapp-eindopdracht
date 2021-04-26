import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import ParallaxScrollView from 'react-native-parallax-scroll-view'
import AppButton from '../../components/appButton'
import Header from '../../components/header'
import StoryBig from '../../components/storyBig'
import SubTitle from '../../components/subTitle'
import {
  userStories,
  getStories,
  userData
} from '../../database/databaseContext'
// https://www.npmjs.com/package/react-native-parallax-scroll-view
import { firebase, firestore } from '../../database/firebase'
import StoryModel from '../../models/Story'

import { app } from '../../styles/app'
// Inside of a component's render() method:

const Profile = ({ route, navigation }: any) => {
  const [stories, setStories] = useState()
  const [storiesPublished, setStoriesPublished] = useState()
  const [loading, setLoading] = useState(true)
  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        alert('Succesfully logged out')
        navigation.navigate('Login')
      })
      .catch((error: any) => alert(error))
  }
  // const createData = async () => {
  //   const story = firebase.firestore().collection("story");
  //   story.doc("TR").set({
  //     userId: "2JvTQVISdihsVOFE9fXcGb4erer2",
  //     title: "Norway Trip 1",
  //     image:
  //       "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.imagesource.com%2Fwp-content%2Fuploads%2F2019%2F06%2FRio.jpg&f=1&nofb=1",
  //   });
  //   story.doc("TR").set({
  //     userId: "2JvTQVISdihsVOFE9fXcGb4erer2",
  //     title: "Norway Trip 2",
  //     image:
  //       "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.imagesource.com%2Fwp-content%2Fuploads%2F2019%2F06%2FRio.jpg&f=1&nofb=1",
  //   });
  // };

  // const getUserStories = () => {
  //   var storiesRef = firestore.collection("story");

  //   storiesRef
  //     .where("author", "==", route.params.user.uid)
  //     .get()
  //     .then((query) => {
  //       let stories: any[] = [];

  //       query.forEach((doc) => {
  //         let newStory = {
  //           id: doc.id,
  //           title: doc.data().title,
  //           image: doc.data().image,
  //           private: doc.data().private,
  //         };

  //         stories.push(newStory);

  //         // ! Dit zorgt ervoor dat ik maar 1 item te zien krijg ipv mijn hele lijst, vandaar de stories.push
  //         // setUserStories([...userStories, newStory]);
  //       });
  //       setUserStories(stories);
  //     })
  //     .catch((error: any) => {
  //       console.log("Error getting documents: ", error);
  //     });
  // };

  const Stories = (published: boolean = true) => {
    let userStoriesData = getStories()

    const html = []

    if (userStoriesData) {
      if (published) {
        userStories.map((data, index) => {
          if (data.private && data.image && data.title) {
            html.push(
              <StoryBig
                key={index}
                title={data.title}
                image={data.image}
                onPress={() =>
                  navigation.navigate('Story', {
                    storyId: data.id,
                    edit: true
                  })
                }
              />
            )
          }
        })
      }
    } else {
      html.push(<Text>Geen trips gevonden</Text>)
    }

    return html
  }
  // useEffect(() => {
  //   createData();
  //   fetchStories()s;
  // }, []);
  // useFocusEffect(
  //   useCallback(() => {
  //     getStories()
  //     setLoading(false)
  //     console.log(getStories())
  //   }, [userStories])
  // )

  useEffect(() => {
    getStories()
    setLoading(false)
  }, [])

  if (loading) {
    return <ActivityIndicator></ActivityIndicator>
  } else {
    return (
      <SafeAreaView>
        <ScrollView style={app.container}>
          <Header
            title='Profile'
            subTitle={userData?.displayName}
            props={route.params}
          />
          <SubTitle
            title='Trips in progress'
            add
            onPress={() => navigation.navigate('AddStory')}
          />

          {userStories ? (
            userStories.map((data, index) => {
              if (data.private && data.image && data.title) {
                return (
                  <StoryBig
                    key={index}
                    title={data.title}
                    image={data.image}
                    onPress={() =>
                      navigation.navigate('Story', {
                        storyId: data.id,
                        edit: true
                      })
                    }
                  />
                )
              }
            })
          ) : (
            <Text>You don't have any published stories yet.</Text>
          )}
          <SubTitle title='Published trips' />

          {userStories ? (
            userStories.map((data, index) => {
              if (!data.private && data.image && data.title) {
                return (
                  <StoryBig
                    key={index}
                    title={data.title}
                    image={data.image}
                    onPress={() =>
                      navigation.navigate('Story', {
                        storyId: data.id,
                        edit: false
                      })
                    }
                  />
                )
              }
            })
          ) : (
            <Text>You don't have any published stories yet.</Text>
          )}

          <AppButton onPress={() => signOut()} title='Logout' />
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export default Profile
