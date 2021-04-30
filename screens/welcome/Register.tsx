import React, { useEffect, useState, useCallback } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { app } from '../../styles/app'
import { header } from '../../styles/components/header'
import AppButton from '../../components/appButton'

import { firebase, firestore } from '../../database/firebase'
import { color } from '../../styles/colors'
import { setUserData } from '../../database/databaseContext'

const Register = ({ navigation }: any) => {
  const [username, setUsername] = useState('Maxime')
  const [email, setEmail] = useState('maxime6128@gmail.com')
  const [password, setPassword] = useState('E')

  const [loading, setLoading] = useState(false)

  const registerUser = () => {
    if (email === '' && password === '') {
      Alert.alert('Enter details to signup!')
    } else {
      setLoading(true)
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((res: any) => {
          res.user.updateProfile({
            displayName: username
          })

          firestore
            .collection('user')
            .doc(res.user.userId)
            .set({
              uid:res.user.uid,
              displayName: res.user.displayName,
              email: res.user.email,
              photoURL: res.user.photoURL
            })

          console.log('User registered successfully!')
          setLoading(false)
          setUsername('')
          setPassword('')
          setEmail('')

          setUserData(res.user)

          navigation.navigate('TabNavigation', {
            email: 'test'
          })
        })
        .catch(error => {
          alert(error)
          setLoading(false)
        })
    }
  }
  if (loading) {
    return (
      <View style={app.activityIndicator}>
        <ActivityIndicator size='large' color={color.gray} />
      </View>
    )
  } else {
    return (
      <SafeAreaView style={[app.container, app.containerWelcome]}>
        <KeyboardAvoidingView
          behavior='padding'
          enabled
          keyboardVerticalOffset={0}
        >
          <View>
            <Text style={header.title}>Travler</Text>
            <Text style={app.label}>Register your account</Text>
            <TextInput
              style={app.input}
              onChangeText={setUsername}
              value={username}
              placeholder='Username..'
            />
            <TextInput
              style={app.input}
              onChangeText={setEmail}
              value={email}
              placeholder='Email..'
            />
            <TextInput
              style={app.input}
              onChangeText={setPassword}
              value={password}
              placeholder='Password..'
              secureTextEntry={true}
            />

            <AppButton title='Register' onPress={() => registerUser()} />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login')
              }}
            >
              <Text style={app.signUp}>I already have an account</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}

export default Register
