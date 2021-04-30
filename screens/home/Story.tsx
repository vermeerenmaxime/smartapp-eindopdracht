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
  ActivityIndicator,
  Switch,
  RefreshControl
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import SubTitle from '../../components/subTitle'

import { LinearGradient } from 'expo-linear-gradient'

import { app } from '../../styles/app'
import { story } from '../../styles/components/story'

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import {
  faHeart,
  faLocationArrow,
  faMapMarked,
  faMapMarkedAlt,
  faPencilAlt,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons'
import { firebase, firestore } from '../../database/firebase'
import { useFocusEffect } from '@react-navigation/native'

import StoryModel from '../../models/Story'
import ArticleModel from '../../models/Article'
import ArticleImage from '../../components/articleImage'
import UserModel from '../../models/User'
import AppButton from '../../components/appButton'
import { Overlay } from 'react-native-elements'

import { getStories, userData } from '../../database/databaseContext'
import { color } from '../../styles/colors'

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

const Story = ({ route, navigation, user }: any) => {
  const imageUrl = {
    uri:
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F6%2F67%2FGeirangerfjord%252C_Norway_%2528Unsplash%2529.jpg%2F640px-Geirangerfjord%252C_Norway_%2528Unsplash%2529.jpg&f=1&nofb=1'
  }
  const storyId = route.params.storyId

  const [storyData, setStoryData] = useState<StoryModel>({
    id: storyId,
    author: '',
    description: '',
    image: '',
    likes: 0,
    private: true,
    title: ''
  })
  const [storyArticles, setStoryArticles] = useState<ArticleModel[]>([])
  const [storyAuthor, setStoryAuthor] = useState<UserModel>({
    uid: '',
    displayName: '',
    photoURL: '',
    email: ''
  })
  const [overlayStoryEditVisible, setOverlayStoryEditVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  const toggleStoryEditOverlay = () => {
    setOverlayStoryEditVisible(!overlayStoryEditVisible)
  }

  const [visible, setVisible] = useState(false)
  const [overlayImage, setOverlayImage] = useState('')

  const toggleOverlay = () => {
    setVisible(!visible)
  }

  const clickImage = (image: any) => {
    setOverlayImage(image)
    toggleOverlay()
  }

  const getStory = async (storyId: string) => {
    let storiesRef = firestore.collection('story')

    await storiesRef
      .doc(storyId)
      .get()
      .then(doc => {
        let getStoryData: any = doc.data()
        console.log(getStoryData)
        setStoryData(getStoryData)
      })
      .catch((error: any) => {
        console.log('Error getting documents: ', error)
      })
  }
  const getStoryArticles = async (storyId: string) => {
    let articlesRef = firestore.collection('article')
    articlesRef
      .where('storyId', '==', storyId)
      .orderBy('entryDate', 'asc')
      .get()
      .then(query => {
        let articles: any = []
        query.forEach(doc => {
          let newArticle = {
            id: doc.id,
            entryDate: doc.data().entryDate,
            title: doc.data().title,
            images: doc.data().images,
            note: doc.data().note
          }
          articles.push(newArticle)
        })
        setStoryArticles(articles)
      })
      .catch((error: any) => {
        console.log('Error getting documents: ', error)
      })
  }

  const getUserFromUserId = async () => {
    let authorRef = firestore.collection('user')

    await authorRef
      .doc(storyData?.author)
      .get()
      .then(doc => {
        let author: UserModel = {
          uid: doc.id,
          displayName: doc.data()?.displayName,
          email: doc.data()?.email,
          photoURL: doc.data()?.photoURL
        }
        setStoryAuthor(author)
        // let author: any = doc.data()
        // return author;
      })
      .catch((error: any) => {
        console.log('Error getting documents: ', error)
      })
  }

  const updateStory = (published: boolean = storyData.private) => {
    setLoading(true)
    // console.log("foem")
    console.log(storyData)
    firestore
      .collection('story')
      .doc(storyId)
      .update({
        image: storyData.image,
        description: storyData.description,
        private: published,
        title: storyData.title
      })
      .then(() => {
        console.log('-- Story updated firestore database')
      })
      .catch(error => {
        console.error('Error updating document: ', error)
      })
    setLoading(false)
  }

  const likeStory = async () => {
    setLoading(true)

    setStoryData((oldStory: StoryModel) => {
      oldStory.likes = oldStory.likes + 1
      return { ...oldStory }
    })

    await firestore
      .collection('story')
      .doc(storyId)
      .update({
        likes: storyData?.likes
      })
      .then(() => {
        console.log('-- Story liked')
      })
      .catch(error => {
        console.error('Error updating document: ', error)
      })

    setLoading(false)
  }
  const deleteStoryImage = () => {
    let pictureRef = firebase.storage().refFromURL(`${storyData?.image}`)

    pictureRef
      .delete()
      .then(() => {
        console.log('-- Story picture removed from firebase storage')
      })
      .catch(err => {
        console.log(err)
      })
  }
  const deleteStory = () => {
    setLoading(true)
    deleteStoryImage()

    firestore
      .collection('story')
      .doc(storyId)
      .delete()
      .then(() => {
        console.log('-- Story removed from firestore database')

        navigation.navigate('Profile')
      })
      .catch(error => {
        console.error('Error removing document: ', error)
      })
    setLoading(false)
  }
  const changeStoryImage = () => {}

  const [storyPrivate, setStoryPrivate] = useState<boolean>()
  const toggleSwitchPrivate = () => {
    if (storyPrivate) setStoryPrivate(false)
    else setStoryPrivate(true)
    updateStory(!storyPrivate)
    // console.log('2', storyPrivate)

    // setStoryData((oldStory: StoryModel) => {
    //   oldStory.private = storyPrivate
    //   return { ...oldStory }
    // })
  }

  const Published = () => {
    if (userData.uid === storyData?.author) {
      return (
        <View
          style={{
            marginVertical: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Text>Private trip</Text>
          <Switch
            ios_backgroundColor='#3e3e3e'
            onValueChange={toggleSwitchPrivate}
            value={storyPrivate}
          />
        </View>
      )
    } else {
      return null
    }
  }
  useEffect(() => {
    setLoading(true)
    getStory(storyId)
    getStoryArticles(storyId)
  }, [])

  useEffect(() => {
    getUserFromUserId()
    setLoading(false)
    setStoryPrivate(storyData.private)
  }, [storyData])

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    wait(2000).then(() => setRefreshing(false))
    getStoryArticles(storyId)
  }, [])

  if (loading) {
    return (
      <View style={app.activityIndicator}>
        <ActivityIndicator size='large' color={color.gray} />
      </View>
    )
  } else {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ImageBackground
          source={{ uri: storyData?.image }}
          style={[story.image]}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
            start={[0.5, 0]}
            style={[story.linearGradient]}
          >
            <View
              style={{
                width: '100%',

                marginBottom: -22,
                zIndex: 2,
                alignItems: 'flex-end',
                flexDirection: 'row'
                // backgroundColor: "blue",
              }}
            >
              <TouchableOpacity style={story.avatar}>
                <View>
                  <Image
                    style={story.avatarImage}
                    source={{ uri: storyAuthor?.photoURL }}
                  />
                </View>
              </TouchableOpacity>
              <View
                style={{
                  marginLeft: 12,
                  justifyContent: 'space-around',
                  flexDirection: 'column'
                }}
              >
                <Text style={story.author}>
                  written by <Text>{storyAuthor?.displayName}</Text>
                </Text>
                <View style={story.likes}>
                  <FontAwesomeIcon
                    icon={faHeart}
                    size={12}
                    style={story.likesIcon}
                  />
                  <Text style={story.likesText}>
                    {storyData?.likes} people liked this trip
                  </Text>
                </View>
              </View>
            </View>
            {route.params.edit ? (
              <TouchableOpacity
                style={story.like}
                onPress={() => toggleStoryEditOverlay()}
              >
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  size={18}
                  style={story.likeIcon}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={story.like} onPress={() => likeStory()}>
                <FontAwesomeIcon
                  icon={faHeart}
                  size={32}
                  style={story.likeIcon}
                />
              </TouchableOpacity>
            )}
          </LinearGradient>
        </ImageBackground>

        <View style={[app.container, { marginTop: 32 }]}>
          <View>
            <Text style={story.title}>{storyData?.title}</Text>
            <Text>{storyData?.description}</Text>
            {(storyData?.lat && storyData?.long) && (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 8
                }}
                onPress={() =>
                  navigation.navigate('MapOverview', {
                    region: {
                      latitude: storyData?.lat,
                      longitude: storyData?.long,
        
                    }
                  })
                }
              >
                <View
                  style={{
                    padding: 8,
                    backgroundColor: 'white',
                    borderRadius: 50
                  }}
                >
                  <FontAwesomeIcon icon={faMapMarkedAlt} size={16} style={{}} />
                </View>
                <Text style={{ padding: 8 }}>Go to location on map </Text>
              </TouchableOpacity>
            )}
          </View>

          {storyArticles ? (
            storyArticles.map((article, index) => {
              return (
                <View key={index}>
                  {route.params.edit ? (
                    <SubTitle
                      title={article.title}
                      edit
                      onPress={() => {
                        navigation.navigate('EditArticle', {
                          story: storyData,
                          storyId: storyId,
                          article: article,
                          articleId: article.id
                        })
                      }}
                    ></SubTitle>
                  ) : (
                    <SubTitle title={article.title}></SubTitle>
                  )}

                  <Text>{article.note}</Text>
                  {article.images && (
                    <ScrollView
                      horizontal={true}
                      style={[story.articleImages, app.scrollViewHorizontal]}
                    >
                      {article.images
                        ? article.images.map((image, index) => {
                            return (
                              <ArticleImage
                                key={index}
                                uri={image}
                                onPress={() => {
                                  clickImage(image)
                                }}
                              ></ArticleImage>
                            )
                          })
                        : null}
                    </ScrollView>
                  )}
                </View>
              )
            })
          ) : (
            <View>
              <Text>Deze trip heeft nog geen artikels</Text>
            </View>
          )}
          {route.params.edit ? (
            <AppButton
              style={{ marginTop: 16 }}
              title='Add article'
              onPress={() => {
                console.log(storyId)
                navigation.navigate('AddArticle', {
                  storyId: storyId
                })
              }}
            ></AppButton>
          ) : null}
          <Published />
        </View>
        {route.params.edit ? (
          <Overlay
            isVisible={overlayStoryEditVisible}
            onBackdropPress={toggleStoryEditOverlay}
            overlayStyle={{
              width: '80%',

              padding: 0,
              borderRadius: 12,
              overflow: 'hidden'
            }}
          >
            <TouchableOpacity onPress={() => changeStoryImage()}>
              <Image
                source={{ uri: storyData?.image }}
                style={{
                  alignSelf: 'center',
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  width: '100%',
                  height: 150,
                  shadowColor: 'black',
                  shadowOpacity: 0.06,
                  shadowRadius: 25,
                  backgroundColor: 'red'
                }}
              ></Image>
            </TouchableOpacity>

            <View style={{ padding: 16 }}>
              <SubTitle title='Edit trip'></SubTitle>
              <TextInput
                style={app.input}
                onChangeText={(text: string) => {
                  setStoryData((oldStory: StoryModel) => {
                    oldStory.title = text
                    return { ...oldStory }
                  })
                }}
                value={storyData?.title}
                placeholder='Story title..'
              />
              <TextInput
                style={[app.input, { minHeight: 100, paddingTop: 16 }]}
                onChangeText={(text: string) => {
                  setStoryData((oldStory: StoryModel) => {
                    oldStory.description = text
                    return { ...oldStory }
                  })
                }}
                value={storyData?.description}
                placeholder='Story description..'
                multiline={true}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}
              >
                <AppButton
                  onPress={() => deleteStory()}
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
                  onPress={() => {
                    updateStory(), toggleStoryEditOverlay()
                  }}
                  title='Save changes'
                  style={{ width: '75%' }}
                />
              </View>
            </View>
          </Overlay>
        ) : null}
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
      </ScrollView>
    )
  }
}

export default Story
