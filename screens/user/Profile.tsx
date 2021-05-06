import React, { useCallback, useEffect, useState } from 'react'
import { Text, SafeAreaView, ScrollView, RefreshControl } from 'react-native'

import Header from '../../components/header'
import Loader from '../../components/loader'
import StoryBig from '../../components/storyBig'
import SubTitle from '../../components/subTitle'
import { userData } from '../../database/databaseContext'

import { firebase, firestore } from '../../database/firebase'
import StoryModel from '../../models/Story'

import { app } from '../../styles/app'
import { wait } from '../../utils/wait'

const Profile = ({ route, navigation }: any) => {
  const [loading, setLoading] = useState(true)
  const [stories, setStories] = useState<StoryModel[]>()

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    wait(2000).then(() => setRefreshing(false))
    getUserStories()
  }, [])

  const storiesRef = firestore.collection('story')
  const getUserStories = async () => {
    let stories: StoryModel[] = []
    await storiesRef
      .where('author', '==', userData.uid)
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

  useEffect(() => {
    getUserStories()

    setLoading(false)
  }, [])

  if (loading) {
    return <Loader></Loader>
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
            props={route.params}
            navigation={navigation}
          />
          <SubTitle
            title='Trips in progress'
            add
            onPress={() => navigation.navigate('AddStory')}
          />

          {stories?.filter(data => data.private == true).length ? (
            stories
              .filter(data => data.private == true && data.image && data.title)
              .map((data, index) => {
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
              })
          ) : (
            <Text>
              🌏 You haven't made any trips yet. Start exploring the world and
              share your trips with all users on Travler!
            </Text>
          )}
          <SubTitle title='Published trips' />

          {stories?.filter(data => data.private == false).length ? (
            stories
              .filter(data => data.private == false)
              .map((data, index) => {
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
              })
          ) : (
            <Text>
              😿 You don't have any trips published yet! Publish a story by
              making your story not private anymore.
            </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    )
  }
}

export default Profile
