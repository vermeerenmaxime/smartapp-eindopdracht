import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl
} from 'react-native'

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
import { color } from '../../styles/colors'

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

const Profile = ({ route, navigation }: any) => {
  const [loading, setLoading] = useState(true)
  const [stories, setStories] = useState<StoryModel[]>()
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

  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    wait(2000).then(() => setRefreshing(false))
  }, [])

  const storiesRef = firestore.collection('story')
  const getUserStories = async () => {
    let stories: StoryModel[] = []
    await storiesRef
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
          stories.push(newStory)
        })
        setStories(stories)
      })
      .catch((error: any) => {
        console.log('Error getting documents: ', error)
      })
    return stories
  }

  useEffect(() => {
    // getStories()
    getUserStories()

    setLoading(false)
  }, [])

  if (loading) {
    return (
      <View style={app.activityIndicator}>
        <ActivityIndicator size='large' color={color.gray} />
      </View>
    )
  } else {
    return (
      <SafeAreaView>
        <ScrollView
          style={app.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
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

          {stories ? (
            stories.map((data, index) => {
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
            <Text>You don't have any published trips yet.</Text>
          )}
          <SubTitle title='Published trips' />

          {stories ? (
            stories.map((data, index) => {
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
