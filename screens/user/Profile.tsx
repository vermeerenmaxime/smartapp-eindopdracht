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

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

const Profile = ({ route, navigation }: any) => {
  // const [userStories, setUserStories] = useState([
  //   {
  //     author: '',
  //     description: '',
  //     image: '',
  //     likes: '',
  //     private: true,
  //     title: ''
  //   }
  // ])

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

  const [refreshing, setRefreshing] = React.useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    wait(2000).then(() => setRefreshing(false))
  }, [])

  // useFocusEffect(
  //   useCallback(() => {
  //     getStories()
  //     setLoading(false)
  //     console.log(getStories())
  //   }, [])
  // )

  useEffect(() => {
    getStories()
    // setUserStories(getStories())
    setLoading(false)
  })

  if (loading) {
    return <ActivityIndicator></ActivityIndicator>
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
          {console.log(userStories)}
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
            <Text>You don't have any published trips yet.</Text>
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
