import React, { useEffect, useState } from 'react'

import { Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { firebase, firestore } from '../../database/firebase'

import Loader from '../../components/loader'
import { app } from '../../styles/app'
import StoryModel from '../../models/Story'
import { userData } from '../../database/databaseContext'
import Header from '../../components/header'

const Fy = ({ route, navigation }: any) => {
  const [loading, setLoading] = useState(true)
  const [stories, setStories] = useState<StoryModel[] | undefined>()

  const [storyData, setStoryData] = useState<StoryModel>({
    id: '',
    author: '',
    description: '',
    image: '',
    likes: 0,
    private: true,
    title: ''
  })

  const getRandomStory = async (storyId: string) => {}

  const storiesRef = firestore.collection('story')
  const getStories = async () => {
    let stories: StoryModel[] = []
    await storiesRef
      .where('author', '!=', userData.uid)
      .orderBy('entryDate', 'asc')
      .limit(10)
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
    getStories()
    setLoading(false)
  }, [])

  if (loading) {
    return <Loader />
  } else {
    return (
      <SafeAreaView>
        <ScrollView style={app.container}>
          <Header
            title='For You'
            props={route.params}
            navigation={navigation}
          />

          {stories &&
            stories.map(story => {
              console.log('hi')
              return (
                <View style={{ backgroundColor: 'red', height: '100%' }}>
                  <Text>{story.title}</Text>
                </View>
              )
            })}
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export default Fy
