import React, { useEffect, useState, useCallback } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import {
  Switch,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Platform,
  KeyboardAvoidingView
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import * as ImagePicker from 'expo-image-picker'

import Header from '../../components/header'
import SubTitle from '../../components/subTitle'

import { app } from '../../styles/app'
import { color } from '../../styles/colors'
import SwitchHeader from '../../components/switchHeader'
import { switchHeader } from '../../styles/components/switchHeader'
import { story } from '../../styles/components/story'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ArticleImage from '../../components/articleImage'
import AppButton from '../../components/appButton'

import { firebase, firestore } from '../../database/firebase'
import StoryModel from '../../models/Story'
import { userData } from '../../database/databaseContext'

const AddStory = ({ route, navigation }: any) => {
  const [storyPrivate, setStoryPrivate] = useState(false)

  const [storyTitle, setStoryTitle] = useState('')
  const [storyDescription, setStoryDescription] = useState('')
  const [storyImage, setStoryImage] = useState('')
  const [storyImageUrl, setStoryImageUrl] = useState('')
  const [storyAuthor, setStoryAuthor] = useState(userData?.uid)

  const [storyData, setStoryData] = useState<StoryModel>({
    entryDate: new Date().toLocaleString(),
    author: '',
    description: '',
    image: '',
    likes: '0',
    private: true,
    title: ''
  })

  useEffect(() => {
    ;(async () => {
      if (Platform.OS !== 'web') {
        const {
          status
        } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })()
    setStoryTitle('')
    setStoryDescription('')
    setStoryImage('')
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.cancelled) {
      setStoryImage(result.uri)
      console.log(storyImage)
    }
  }

  const toggleSwitch = () => {
    if (storyPrivate) setStoryPrivate(false)
    else setStoryPrivate(true)
  }

  const uploadImage = async (uri: any, imageName: string) => {
    const response = await fetch(uri)
    const blob = await response.blob()

    let ref = firebase
      .storage()
      .ref()
      .child('images/' + imageName)

    return await ref.put(blob)
  }

  const getImageFromUpload = async (imageName: any) => {
    let storage = firebase.storage()
    let storageRef = storage.ref()
    let starsRef = storageRef.child('images/' + imageName)

    // Geen await anders geeft hij geen url
    starsRef
      .getDownloadURL()
      .then((url: string) => {
        console.log(url)
        setStoryImageUrl(url)
        console.log('(url) ', storyImageUrl)
      })
      .catch(error => {
        console.log('error', error)
        setStoryImage('NoImgFound')
      })
  }

  const createStory = async () => {
    if (storyTitle && storyDescription && storyImage) {
      let imageName = `story-${route.params.user.uid}-${new Date().getTime()}`
      console.log('StoryImage      =>', storyImage)
      console.log('ImageName       =>', imageName)

      await uploadImage(storyImage, imageName)
        .then(async () => {
          console.log('-- Image uploaded --')
        })
        .catch(error => {
          Alert.alert(error)
        })

      getImageFromUpload(imageName)
      console.log('StoryimageUrl    =>', storyImageUrl)

      const newStoryRef = firestore.collection('story')
      await newStoryRef
        .add({
          entryDate: storyData?.entryDate,
          description: storyDescription,
          title: storyTitle,
          image: storyImageUrl,
          imageName: imageName,
          author: storyAuthor,
          likes: '0',
          private: storyPrivate
        })
        .then(doc => {
          console.log('Story succesfully created!')
          navigation.navigate('Story', { storyId: doc.id })
        })
        .catch(error => {
          console.error('Error writing document: ', error)
        })
    } else {
      Alert.alert('Please fill in all fields')
    }
  }
  return (
    <SafeAreaView>
      <View style={app.container}>
        <Header title='Create' props={route.params} />

        <SwitchHeader navigation={navigation}></SwitchHeader>
      </View>
      <KeyboardAvoidingView
        behavior='padding'
        enabled
        keyboardVerticalOffset={0}
      >
        <ScrollView style={app.container}>
          <SubTitle title='Name trip' />
          <TextInput
            style={app.input}
            onChangeText={setStoryTitle}
            value={storyTitle}
            placeholder='Tripname..'
          />
          <SubTitle title='Description' />
          <TextInput
            style={[app.input, { minHeight: 100, paddingTop: 16 }]}
            onChangeText={setStoryDescription}
            value={storyDescription}
            placeholder='Description..'
            multiline={true}
          />
          <SubTitle title='Add story image' />

          {storyImage ? (
            <ArticleImage onPress={pickImage} uri={storyImage}></ArticleImage>
          ) : (
            <TouchableOpacity
              style={[story.articleImage, { backgroundColor: 'white' }]}
              onPress={pickImage}
            >
              <FontAwesomeIcon
                icon={faPlus}
                size={24}
                color={color.lightGray}
              />
            </TouchableOpacity>
          )}

          <View
            style={{
              marginTop: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <Text>Publish trip</Text>
            <Switch
              ios_backgroundColor='#3e3e3e'
              onValueChange={toggleSwitch}
              value={storyPrivate}
            />
          </View>
          <AppButton
            style={{
              marginTop: 16,
              marginBottom: 200
            }}
            onPress={() => createStory()}
            title='Create'
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default AddStory
