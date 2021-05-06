import React from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { useFonts } from 'expo-font'

import TabNavigation from './navigator/MainNavigation'
import Login from './screens/welcome/Login'
import Register from './screens/welcome/Register'
import Loader from './components/loader'

const Stack = createStackNavigator()

export default function App () {
  const [loaded, error] = useFonts({
    Roboto: require('./assets/fonts/roboto/Roboto-Regular.ttf'),
    RobotoBold: require('./assets/fonts/roboto/Roboto-Bold.ttf'),
    RobotoMedium: require('./assets/fonts/roboto/Roboto-Medium.ttf')
  })
  if (loaded) {
    return (
      <NavigationContainer>
        <Stack.Navigator headerMode='none'>
          <Stack.Screen name='Login' component={Login} />
          <Stack.Screen name='Register' component={Register} />
          <Stack.Screen name='TabNavigation' component={TabNavigation} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  } else {
    return <Loader />
  }
}
