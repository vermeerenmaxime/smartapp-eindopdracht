import React, { useEffect, useState, useCallback } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Image,
  KeyboardAvoidingView,
  SkewXTransform,
  Platform,
  Picker,
  ActivityIndicator
} from 'react-native'

import { Select, Option } from 'react-native-select-lists'
// https://www.npmjs.com/package/react-native-lists-select

import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'

import { Button, Overlay } from 'react-native-elements'
import { SafeAreaView } from 'react-native-safe-area-context'

import { app } from '../../styles/app'
import { color } from '../../styles/colors'
import { switchHeader } from '../../styles/components/switchHeader'
import { story } from '../../styles/components/story'

import Header from '../../components/header'
import SubTitle from '../../components/subTitle'
import ArticleImage from '../../components/articleImage'
import SwitchHeader from '../../components/switchHeader'
import AppButton from '../../components/appButton'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import ArticleModel from '../../models/Article'
import {
  getStories,
  getStoryFromUserLatest,
  userData,
  userStories
} from '../../database/databaseContext'
import { firebase, firestore } from '../../database/firebase'
import { useFocusEffect } from '@react-navigation/native'
import StoryModel from '../../models/Story'

const AddArticle = ({ route, navigation }: any) => {
  const [visible, setVisible] = useState(false)
  const [overlayImage, setOverlayImage] = useState('')

  const storyId = route.params.storyId ? route.params.storyId : ''

  const [articleStory, setArticleStory] = useState('')
  const [articleData, setArticleData] = useState<ArticleModel>({
    storyId: storyId,
    entryDate: new Date(),
    title: '',
    note: '',
    images: []
  })

  const toggleOverlay = () => {
    setVisible(!visible)
  }

  const [articleImages, setArticleImages] = useState<string[]>([])

  const clickImage = (image: any) => {
    setOverlayImage(image)
    toggleOverlay()
  }

  const deleteImage = (image: any) => {
    console.log('Delete image:', image)

    setArticleImages(articleImages.filter(item => item !== image))
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
    getStories()
    console.log('StoryId', storyId)
    if (storyId) {
      setArticleData((oldArticle: ArticleModel) => {
        oldArticle.storyId = storyId
        return { ...oldArticle }
      })
    } else {
      setArticleData((oldArticle: ArticleModel) => {
        let story: StoryModel = getStoryFromUserLatest()
        oldArticle.storyId = story.id
        return { ...oldArticle }
      })
    }
  }, [])

  const [uploading, setUploading] = useState(false)
  const [transferred, setTransferred] = useState(0)

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.cancelled) {
      setArticleImages([...articleImages, result.uri])
      console.log(articleImages)
    }
  }

  const uploadImage = async (image: string, imageName: string) => {
    const response = await fetch(image)
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
      console.log(url)
      return url
    } catch (e) {
      return null
    }
  }

  const addArticle = async () => {
    console.log('woop')

    console.log(articleData)
    if (articleData?.title && articleData?.note) {
      console.log('ArticleData:', articleData)
      console.log('ArticleImages:', articleImages)
      let articleImagesUrl: string[] = []
      if (articleImages.length <= 5) {
        if (articleImages) {
          await Promise.all(
            articleImages.map(async (image, index) => {
              let imageName = `article-${
                userData?.uid
              }-${new Date().getTime()}-${index}`

              const imageUploadedUrl = await uploadImage(image, imageName)

              articleImagesUrl.push(imageUploadedUrl)
            })
          )

          console.log("ImageURL's =>", articleImagesUrl)
          await firestore
            .collection('article')
            .add({
              storyId: articleData?.storyId,
              entryDate: articleData?.entryDate,
              title: articleData?.title,
              note: articleData?.note,
              images: articleImagesUrl
            })
            .then(doc => {
              console.log('Article succesfully added!')
              navigation.navigate('Story', { storyId: articleData?.storyId })
            })
            .catch(error => {
              console.error('Error adding article: ', error)
            })
        }
      } else {
        Alert.alert('You can only add 5 images to 1 story')
      }
    } else {
      Alert.alert('Please fill in all fields')
    }
  }
  return (
    <SafeAreaView>
      <View style={app.container}>
        <Header title='Add' props={route.params} />
        <SwitchHeader navigation={navigation} selected></SwitchHeader>
      </View>
      <KeyboardAvoidingView
        behavior='padding'
        enabled
        keyboardVerticalOffset={0}
      >
        <ScrollView style={app.container}>
          <SubTitle title='Trip' />
          <TextInput
            placeholder='Trip..'
            style={app.input}
            placeholderTextColor={color.gray}
            editable={false}
            value={storyId}
          ></TextInput>

          {/* <Picker
            selectedValue={selectedValue}
            style={{ height: 50, width: 150,margin:16 }}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedValue(itemValue)
            }
          >
            <Picker.Item label='Java' value='java' />
            <Picker.Item label='JavaScript' value='js' />
            <Picker.Item label='JavaScript' value='js' />
            <Picker.Item label='JavaScript' value='js' />
            <Picker.Item label='JavaScript' value='js' />
            <Picker.Item label='JavaScript' value='js' />
          </Picker> */}
          {/* <Select
            selectTextStyle={{
              fontSize: 16,
              paddingHorizontal: 8
            }}
            selectStyle={[
              {
                overflow: 'hidden',
                padding: 0,
                margin: 0,
                backgroundColor: 'white',

                borderRadius: 12,
                height: 48
              }
            ]}
            listStyle={{
              backgroundColor: color.light,
              borderColor: color.alpha,
              borderWidth: 2,
              shadowOpacity: 0.05,
              elevation: 50,
              shadowRadius: 50,
              borderRadius: 8
            }}
            placeholder='Choose your trip'
            // onChange={setArticleStory}
            value={articleData?.storyId}
          >
            {userStories ? (
              userStories.map((story, index) => {
                return (
                  <Option
                    key={index}
                    value={story.id}
                    last={true}
                    onPress={() => {
                      // console.log("Hey")
                      setArticleData((oldArticle: ArticleModel) => {
                        oldArticle.storyId = story.id
                        return { ...oldArticle }
                      })
                    }}
                  >
                    {story.title}
                  </Option>
                )
              })
            ) : (
              <Option value={1}>No stories available</Option>
            )}
          </Select> */}
          <SubTitle title='Article' />
          <View style={app.input}>
            <TextInput
              placeholder='Title..'
              style={[story.title]}
              placeholderTextColor={color.gray}
              onChangeText={(text: string) => {
                setArticleData((oldArticle: ArticleModel) => {
                  oldArticle.title = text
                  return { ...oldArticle }
                })
              }}
              value={articleData?.title}
            ></TextInput>
            <TextInput
              placeholder='Write your experience down here..'
              style={{ marginTop: 16 }}
              placeholderTextColor={color.gray}
              multiline={true}
              onChangeText={(text: string) => {
                setArticleData((oldArticle: ArticleModel) => {
                  oldArticle.note = text
                  return { ...oldArticle }
                })
              }}
              value={articleData?.note}
            ></TextInput>
          </View>
          <SubTitle title='Add pictures' />
          <ScrollView
            horizontal={true}
            style={[story.articleImages, app.scrollViewHorizontal]}
          >
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
            {articleImages
              ? articleImages.map((image, index) => {
                  return (
                    <ArticleImage
                      key={index}
                      uri={image}
                      onPress={() => {
                        clickImage(image)
                      }}
                      onLongPress={() => deleteImage(image)}
                    ></ArticleImage>
                  )
                })
              : null}
          </ScrollView>
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
              title='Add to trip'
              style={{
                width: '50%',
                alignSelf: 'flex-end',
                marginTop: 16,
                marginBottom: 200
              }}
              onPress={() => addArticle()}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <Overlay
        isVisible={visible}
        onBackdropPress={toggleOverlay}
        overlayStyle={{
          width: '90%',

          padding: 0,
          borderRadius: 12,
          overflow: 'hidden'
        }}
      >
        <Image
          source={{ uri: overlayImage }}
          style={{
            width: '100%',
            height: 500
          }}
          resizeMode='cover'
        ></Image>
      </Overlay>
    </SafeAreaView>
  )
}

export default AddArticle
