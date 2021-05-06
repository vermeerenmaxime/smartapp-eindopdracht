import React, { useEffect, useState, useCallback } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import Header from '../../components/header'
import SubTitle from '../../components/subTitle'

import { app } from '../../styles/app'
import StorySmall from '../../components/storySmall'
import { userData } from '../../database/databaseContext'
import StoryModel from '../../models/Story'
import { firestore } from '../../database/firebase'

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

const Overview = ({ route, navigation }: any) => {
  const [stories, setStories] = useState<StoryModel[]>()
  const storiesRef = firestore.collection('story')

  const getStoriesTrending = async () => {
    let storiesTrending: StoryModel[] = []

    await storiesRef
      // .where('entryDate', '>=', "")
      .orderBy('likes')
      .where('private', '==', false)
      .limit(5)
      .get()
      .then(query => {
        query.forEach(doc => {
          let story: StoryModel = {
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
          storiesTrending.push(story)
          // setStories([...stories, story])
        })
        setStories(storiesTrending)
      })
      .catch((error: any) => {
        console.log('Error getting documents: ', error)
      })
  }

  useEffect(() => {
    getStoriesTrending()
  }, [])

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    wait(2000).then(() => setRefreshing(false))
    getStoriesTrending()
  }, [])

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView style={app.container}>
        <Header title='Home' props={route.params} navigation={navigation} />
        <View
          style={{
            padding: 16,
            backgroundColor: 'white',
            borderRadius: 12,
            marginTop: 32,
            marginBottom: 24
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Hello! 👋</Text>
          <Text style={{ marginTop: 12 }}>Welcome on Travler.</Text>
          <Text style={{ marginTop: 8 }}>
            Travler is an app where u can write down about your trips. You can
            upload photo's to your articles and share them with other users on
            the platform! 🥳
          </Text>
          <Text style={{ marginTop: 8 }}>
            Discover others their stories on the Travler map. Make sure to check
            it out and cool spots in the world! 🌍
          </Text>
        </View>
        <SubTitle title='Trending on Travler' />
        <ScrollView horizontal={true} style={app.scrollViewHorizontal}>
          {stories &&
            stories.map((story, index) => {
              // console.log(story)
              return (
                <StorySmall
                  key={index}
                  title={story.title}
                  image={story.image}
                  onPress={() =>
                    navigation.navigate('Story', { storyId: story.id })
                  }
                />
              )
            })}
        </ScrollView>
        {/* <SubTitle title='Verified stories' />
        <ScrollView horizontal={true} style={app.scrollViewHorizontal}>
          <StorySmall
            title='Norway Trip 2021'
            onPress={() => navigation.navigate('Story', { storyId: 1 })}
          />
          <StorySmall
            title='Norway Trip 2021'
            onPress={() => navigation.navigate('Story', { storyId: 1 })}
          />
          <StorySmall
            title='Norway Trip 2021'
            onPress={() => navigation.navigate('Story', { storyId: 1 })}
          />
        </ScrollView> */}
      </SafeAreaView>
    </ScrollView>
  )
}

export default Overview
