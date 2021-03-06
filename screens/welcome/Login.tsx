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

import AppButton from '../../components/appButton'

import { app } from '../../styles/app'
import { header } from '../../styles/components/header'

import { firebase } from '../../database/firebase'
import { setUserData } from '../../database/databaseContext'
import Loader from '../../components/loader'

const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState('maxime6128@gmail.com')
  const [password, setPassword] = useState('Eeeeee')

  const [loading, setLoading] = useState(false)

  const userLogin = async () => {
    if (email === '' || password === '') {
      Alert.alert('Enter details to signin!')
    } else {
      setLoading(true)
      await firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((res: any) => {
          console.log('-- User successfully logged in : ', res.user.displayName)

          setEmail('')
          setPassword('')

          setUserData(res.user)

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
            <Text style={app.label}>Login with your account</Text>
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

            <AppButton onPress={() => userLogin()} title='Login' />
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Register')
              }}
            >
              <Text style={app.signUp}>Sign up</Text>
            </TouchableOpacity>
            {/* <Text style={[app.label,{marginTop:32}]}>Forgot password</Text> */}
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}

export default Login
