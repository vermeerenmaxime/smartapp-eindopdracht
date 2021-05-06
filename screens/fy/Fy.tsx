import React, { useCallback, useEffect, useState } from 'react'

import {
  Text,
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  RefreshControl
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { firebase, firestore } from '../../database/firebase'

import Loader from '../../components/loader'
import { app } from '../../styles/app'
import StoryModel from '../../models/Story'
import { userData } from '../../database/databaseContext'
import Header from '../../components/header'
import { color } from '../../styles/colors'
import SubTitle from '../../components/subTitle'

import { wait } from '../../utils/wait'

const Fy = ({ route, navigation }: any) => {
  const [loading, setLoading] = useState(true)
  const [stories, setStories] = useState<StoryModel[] | undefined>()

  const storiesRef = firestore.collection('story')
  const getStories = async () => {
    let stories: StoryModel[] = []
    await storiesRef
      .where('author', '!=', userData.uid)
      .orderBy('author', 'asc')
      .orderBy('entryDate', 'desc')
      .limit(10)
      .get()
      .then((query: any) => {
        query.forEach((doc: any) => {
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

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    wait(2000).then(() => setRefreshing(false))
    getStories()
  }, [])

  useEffect(() => {
    getStories()
    setLoading(false)
  }, [])

  if (loading) {
    return <Loader />
  } else {
    return (
      <SafeAreaView>
        <ScrollView
          style={[app.container, { height: '100%' }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Header
            title='For You'
            props={route.params}
            navigation={navigation}
          />
          <SubTitle title='Latest trips on the platform' />

          {stories?.length ? (
            stories.map(story => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Story', { storyId: story.id })
                  }
                  key={story.id}
                  style={{
                    marginBottom: 24,
                    backgroundColor: color.light,
                    // height: '100%',
                    borderRadius: 12,
                    overflow: 'hidden',

                    shadowColor: 'black',
                    shadowOpacity: 0.1,
                    shadowRadius: 25
                  }}
                >
                  <ImageBackground
                    style={{
                      backgroundColor: color.alpha,
                      height: 200,
                      width: '100%'
                    }}
                    source={{ uri: story.image }}
                  ></ImageBackground>
                  <Text
                    style={{ padding: 16, fontSize: 18, fontWeight: 'bold' }}
                  >
                    {story.title}
                  </Text>
                  <Text style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
                    {story.description}
                  </Text>
                </TouchableOpacity>
              )
            })
          ) : (
            <View
              style={{
                paddingVertical: 32,
                // height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text
                style={{
                  padding: 16,
                  backgroundColor: 'white',
                  borderRadius: 12,
                  overflow: 'hidden',
                  width: '100%'
                }}
              >
                😿 There are no stories available to view.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export default Fy
