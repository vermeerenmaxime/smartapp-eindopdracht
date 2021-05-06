import React, { useState } from 'react'

import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { app } from '../../styles/app'
import { header } from '../../styles/components/header'
import AppButton from '../../components/appButton'

import { firebase, firestore } from '../../database/firebase'
import { setUserData } from '../../database/databaseContext'
import Loader from '../../components/loader'

const Register = ({ navigation }: any) => {
  const [username, setUsername] = useState('Maxime')
  const [email, setEmail] = useState('maxime6128@gmail.com')
  const [password, setPassword] = useState('EEEEEEE')

  const [loading, setLoading] = useState(false)

  const registerUser = () => {
    if (username === '' || email === '' || password === '') {
      Alert.alert('Enter details to signup!')
    } else {
      setLoading(true)
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(async (res: any) => {
          res.user.updateProfile({
            displayName: username
          })

          await firestore
            .collection('user')
            .doc(res.user.uid)
            .set({
              uid: res.user.uid,
              displayName: username,
              email: res.user.email,
              photoURL: res.user.photoURL
            })
          setUserData(res.user)

          console.log('-- User successfully created! ', res.user.displayName)

          setUsername('')
          setPassword('')
          setEmail('')

          navigation.navigate('TabNavigation', {})
        })
        .catch((error: any) => {
          alert(error)
        })
      setLoading(false)
    }
  }
  if (loading) {
    return <Loader />
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
