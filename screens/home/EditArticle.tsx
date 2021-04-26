import React, { useEffect, useState, useCallback } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import {
  ImageBackground,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  TextInput,
  ActivityIndicator
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SubTitle from '../../components/subTitle'

import { app } from '../../styles/app'
import { story } from '../../styles/components/story'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faHeart,
  faPencilAlt,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons'
import { firebase, firestore } from '../../database/firebase'
import { useFocusEffect } from '@react-navigation/native'

import StoryModel from '../../models/Story'
import ArticleModel from '../../models/Article'
import { color } from '../../styles/colors'
import AppButton from '../../components/appButton'
import ArticleImage from '../../components/articleImage'
import { header } from '../../styles/components/header'
import { Overlay } from 'react-native-elements'

const Stack = createStackNavigator()

const EditArticle = ({ route, navigation }: any) => {
  const imageUrl = {
    uri:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F6%2F67%2FGeirangerfjord%252C_Norway_%2528Unsplash%2529.jpg%2F640px-Geirangerfjord%252C_Norway_%2528Unsplash%2529.jpg&f=1&nofb=1'
  }
  const articleId = route.params.articleId
  const article = route.params.article
  const story = route.params.story
  const storyId = route.params.storyId

  const [articleData, setArticleData] = useState<ArticleModel>(article)

  const [visible, setVisible] = useState(false)
  const [overlayImage, setOverlayImage] = useState('')

  const toggleOverlay = () => {
    setVisible(!visible)
  }

  const clickImage = (image: any) => {
    setOverlayImage(image)
    toggleOverlay()
  }

  const [articleImages, setArticleImages] = useState('')
  const [loading, setLoading] = useState(true)

  const getArticle = (articleId: string) => {
    setLoading(true)
    let articleRef = firestore.collection('article')

    articleRef
      .doc(articleId)
      .get()
      .then(doc => {
        let getArticleData: any = doc.data()

        setArticleData(getArticleData)

        console.log('Article', articleData)

        setLoading(false)
      })
      .catch((error: any) => {
        console.log('Error getting documents: ', error)
      })
    setLoading(false)
  }

  const updateArticle = () => {
    setLoading(true)

    firestore
      .collection('article')
      .doc(articleId)
      .update({
        // images: articleData?.images,
        note: articleData?.note,
        title: articleData?.title
      })
      .then(() => {
        console.log('-- Article updated firestore database')
        navigation.navigate('Story', { storyId: story.id })
        setLoading(false)
      })
      .catch(error => {
        console.error('Error updating document: ', error)
      })
  }
  const deleteArticle = () => {}

  useFocusEffect(
    useCallback(() => {
      // getArticle(articleId)
      setArticleData(article)
      console.log('ArticleId', articleId)
      setLoading(false)
    }, [])
  )

  if (loading) {
    return <ActivityIndicator></ActivityIndicator>
  } else {
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={[app.container, { marginTop: 32 }]}>
            <Text style={[header.title, { fontSize: 32 }]}>{story.title}</Text>
            <SubTitle title='Edit article' />
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

            <ScrollView
              horizontal={true}
              style={[story.articleImages, app.scrollViewHorizontal]}
            >
              {/* {articleData?.images
                ? articleData?.images.map(image => {
                  <TouchableOpacity style={[story.articleImage]}></TouchableOpacity>
                  })
                : null} */}
              {articleData?.images
                ? articleData?.images.map((image, index) => {
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <AppButton
                onPress={() => deleteArticle()}
                red
                title={
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    size={18}
                    style={{ color: 'white' }}
                  />
                }
                style={{ width: '20%' }}
              />
              <AppButton
                onPress={() => updateArticle()}
                title='Save changes'
                style={{ width: '75%' }}
              />
            </View>
          </View>
        </ScrollView>
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
}

export default EditArticle
