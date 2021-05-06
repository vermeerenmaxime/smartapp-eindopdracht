import { firebase, firestore } from '../database/firebase'

import React, { useEffect, useState } from 'react'

import {
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Alert
} from 'react-native'
import { Overlay } from 'react-native-elements'
import { app } from '../styles/app'

import * as ImagePicker from 'expo-image-picker'

import { header } from '../styles/components/header'
import UserModel from '../models/User'

import AppButton from './appButton'
import SubTitle from './subTitle'
import {
  // getUserData,
  userData,
  userFromDatabase
} from '../database/databaseContext'

const Header = ({ title, subTitle, props, navigation }: any) => {
  const [overlayVisible, setOverlayVisible] = useState(false)
  const [newUserData, setNewUserDataNew] = useState<UserModel>({
    uid: '',
    displayName: '',
    email: '',
    photoURL: ''
  })

  const [profilePicture, setProfilePicture] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [transferred, setTransferred] = useState(0)

  const uploadImage = async (image: string, imageName: string) => {
    const response = await fetch(image)
    const blob = await response.blob()

    setUploading(true)
    setTransferred(0)

    const storageRef = firebase.storage().ref('images/' + imageName)
    const task = storageRef.put(blob)

    task.on(
      'state_changed',
      (taskSnapshot: { bytesTransferred: number; totalBytes: number }) => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
        )

        setTransferred(
          Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
            100
        )
      }
    )
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

  const updateUser = async () => {
    console.log('update', userData?.uid)

    let profilePictureName = `profile-${userData?.uid}-${new Date().getTime()}`

    let imageUploadedUrl = newUserData?.photoURL

    if (newUserData?.photoURL != profilePicture) {
      imageUploadedUrl = await uploadImage(profilePicture, profilePictureName)
    }

    await firestore
      .collection('user')
      .doc(userData?.uid)
      .update({
        displayName: newUserData?.displayName,
        email: newUserData?.email,
        photoURL: imageUploadedUrl
      })
      .then(() => {
        // Alert.alert('Profile succesfully updated')
      })

    toggleOverlay()
  }

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible)
  }

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.cancelled) {
      setProfilePicture(result.uri)
    }
  }

  // const changeProfilePicture = () => {}

  const getUserData = async () => {
    await firestore
      .collection('user')
      .doc(userData.uid)
      .get()
      .then(doc => {
        setNewUserDataNew({
          uid: doc.id,
          displayName: doc.data()?.displayName,
          email: doc.data()?.email,
          photoURL: doc.data()?.photoURL
        })
        setProfilePicture(doc.data()?.photoURL)
      })
  }

  useEffect(() => {
    getUserData()
  }, [])

  return (
    <View style={header.container}>
      <View>
        <Text>{subTitle && subTitle}</Text>
        <Text style={header.title}>{title}</Text>
      </View>
      <View>
        <TouchableOpacity onPress={() => toggleOverlay()} style={header.avatar}>
          {/* <View style={header.notificationCircle}>
            <Text style={header.notificationCircleText}>1</Text>
          </View> */}
          <View>
            <Image
              style={header.avatarImage}
              source={{
                uri: profilePicture
                  ? profilePicture
                  : 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ferp.24h.com.vn%2FContent%2Fimage%2Fupload%2Fdefault_avartar.png'
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
      <Overlay
        isVisible={overlayVisible}
        onBackdropPress={toggleOverlay}
        overlayStyle={{
          width: '70%',

          padding: 16,
          borderRadius: 12,
          overflow: 'hidden'
        }}
      >
        <TouchableOpacity onPress={() => pickImage()}>
          <Image
            source={{ uri: profilePicture }}
            style={{
              alignSelf: 'center',
              borderRadius: 100,
              width: 128,
              height: 128,
              marginVertical: 8,
              shadowColor: 'black',
              shadowOpacity: 0.06,
              shadowRadius: 25,
              backgroundColor: 'red'
            }}
          ></Image>
        </TouchableOpacity>
        <SubTitle title='Profile settings'></SubTitle>
        <TextInput
          style={app.input}
          onChangeText={(text: string) => {
            setNewUserDataNew((oldUser: UserModel) => {
              oldUser.displayName = text
              return { ...oldUser }
            })
          }}
          value={newUserData?.displayName}
          placeholder='Username..'
        />
        <TextInput
          style={app.input}
          onChangeText={(text: string) => {
            setNewUserDataNew((oldUser: UserModel) => {
              oldUser.email = text
              return { ...oldUser }
            })
          }}
          value={newUserData?.email}
          placeholder='Email..'
        />
        <AppButton onPress={() => updateUser()} title='Update' />
        <AppButton red onPress={() => signOut()} title='Logout' />
      </Overlay>
    </View>
  )
}

export default Header
