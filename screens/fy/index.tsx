import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import AddArticle from '../home/AddArticle'
import AddStory from '../home/AddStory'
import Fy from './Fy'
import Story from '../home/Story'

const Stack = createStackNavigator()

const Add = ({ route, navigation }: any) => {
  return (
    // headerMode="none"
    <Stack.Navigator headerMode='none' initialRouteName='Fy'>
      <Stack.Screen
        name='Fy'
        component={Fy}
        initialParams={route.params}
      ></Stack.Screen>
      <Stack.Screen
        name='Story'
        component={Story}
        initialParams={route.params}
      ></Stack.Screen>
    </Stack.Navigator>
  )
}

export default Add
