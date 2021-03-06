import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Overview from './Overview'
import Story from './Story'
import EditArticle from './EditArticle'
import AddArticle from './AddArticle'
import MapOverview from '../map/MapOverview'

const Stack = createStackNavigator()

const Home = ({ route, navigation }: any) => {
  return (
    <Stack.Navigator headerMode='none' initialRouteName='Overview'>
      <Stack.Screen
        name='Overview'
        component={Overview}
        initialParams={route.params}
      ></Stack.Screen>
      <Stack.Screen
        name='Story'
        component={Story}
        initialParams={route.params}
      ></Stack.Screen>
      <Stack.Screen
        name='EditArticle'
        component={EditArticle}
        initialParams={route.params}
      ></Stack.Screen>
      <Stack.Screen
        name='AddArticle'
        component={AddArticle}
        initialParams={route.params}
      ></Stack.Screen>
      <Stack.Screen
        name='MapOverview'
        component={MapOverview}
        initialParams={route.params}
      ></Stack.Screen>
    </Stack.Navigator>
  )
}

export default Home
