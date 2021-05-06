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
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

import * as Location from 'expo-location'

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
import Loader from '../../components/loader'

const AddStory = ({ route, navigation }: any) => {
  const [storyPrivate, setStoryPrivate] = useState(true)

  const [storyTitle, setStoryTitle] = useState('')
  const [storyDescription, setStoryDescription] = useState('')
  const [storyImage, setStoryImage] = useState('')
  const [storyImageUrl, setStoryImageUrl] = useState('')
  const [storyAuthor, setStoryAuthor] = useState(userData?.uid)

  const [storyData, setStoryData] = useState<StoryModel>({
    entryDate: new Date().toLocaleString(),
    author: userData?.uid,
    description: '',
    image: '',
    likes: 0,
    private: true,
    title: ''
  })

  const [loading, setLoading] = useState(true)
  const [locationPermission, setLocationPermission] = useState(false)

  const [uploading, setUploading] = useState(false)
  const [transferred, setTransferred] = useState(0)

  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0
  })
  const getLocationAsync = async () => {
    setLoading(true)
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      Alert.alert('Cannot load location, permission is denied')
      setLocationPermission(false)
    } else {
      setLocationPermission(true)
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest
      })

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })
    }
    setLoading(false)
  }

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
    getLocationAsync()
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

  const uploadImage = async (imageName: string) => {
    const response = await fetch(storyImage)
    const blob = await response.blob()

    setUploading(true)
    setTransferred(0)

    const storageRef = firebase.storage().ref('images/' + imageName)
    const task = storageRef.put(blob)


    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
      )

      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100
      )
    })
    try {
      await task

      const url = await storageRef.getDownloadURL()

      setUploading(false)
      console.log('-- Image uploaded --')
      return url
    } catch (e) {
      return null
    }
  }

  const createStory = async () => {
    if (storyTitle && storyDescription && storyImage) {
      let imageName = `story-${userData?.uid}-${new Date().getTime()}`
      console.log('StoryImage      =>', storyImage)
      console.log('ImageName       =>', imageName)

      const imageUrl = await uploadImage(imageName)

      await firestore
        .collection('story')
        .add({
          entryDate: storyData?.entryDate,
          description: storyDescription,
          title: storyTitle,
          image: imageUrl,
          imageName: imageName,
          author: storyData?.author,
          likes: 0,
          private: storyPrivate,
          lat: region.latitude,
          long: region.longitude
        })
        .then(doc => {
          console.log('Story succesfully created!', doc)
          navigation.navigate('Story', { storyId: doc.id, edit: true })
        })
        .catch(error => {
          console.error('Error writing document: ', error)
        })
    } else {
      Alert.alert('Please fill in all fields')
    }
  }
  if (loading) {
    return <Loader />
  } else {
    return (
      <SafeAreaView>
        <View style={app.container}>
          <Header title='Create' props={route.params} navigation={navigation}/>

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
              <Text>Private trip</Text>
              <Switch
                ios_backgroundColor='#3e3e3e'
                onValueChange={toggleSwitch}
                value={storyPrivate}
              />
            </View>
            {uploading ? (
              <View style={{ marginTop: 16 }}>
                {transferred == 100 ? (
                  <SubTitle title='Image succesfully uploaded!'></SubTitle>
                ) : (
                  <View>
                    <SubTitle title='Uploading image'></SubTitle>
                    <Text>{transferred}% completed!</Text>
                    <ActivityIndicator size='large' color={color.gray} />
                  </View>
                )}
              </View>
            ) : (
              <AppButton
                style={{
                  marginTop: 16,
                  marginBottom: 200
                }}
                onPress={() => createStory()}
                title='Create'
              />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}

export default AddStory
