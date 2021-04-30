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

  // console.log(newUserData)

  const updateUser = () => {
    console.log('update', userData?.uid)
    firestore
      .collection('user')
      .doc(userData?.uid)
      .update({
        displayName: newUserData?.displayName,
        email: newUserData?.email,
        photoURL: newUserData?.photoURL
      })
      .then(() => {
        Alert.alert('Profile succesfully updated')
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

  const changeProfilePicture = () => {}

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
        <TouchableOpacity
          onPress={() => toggleOverlay()}
          style={header.avatar}
        >
          <View style={header.notificationCircle}>
            <Text style={header.notificationCircleText}>1</Text>
          </View>
          <View>
            <Image
              style={header.avatarImage}
              source={{
                uri: newUserData?.photoURL
                  ? newUserData?.photoURL
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
        <TouchableOpacity onPress={() => changeProfilePicture()}>
          <Image
            source={{ uri: newUserData?.photoURL }}
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
