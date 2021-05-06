import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons'

const Tab = createBottomTabNavigator()

import Home from '../screens/home'
import User from '../screens/user'
import Add from '../screens/add'
import Map from '../screens/map'
import Fy from '../screens/fy'

import { color } from '../styles/colors'

import { navigationBottom } from '../styles/components/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import {
  faGlobeEurope,
  faHome,
  faMapMarkedAlt,
  faPlus,
  faUser
} from '@fortawesome/free-solid-svg-icons'

export default function MainNavigation ({ route, navigation }: any) {
  return (
    <Tab.Navigator
      tabBarOptions={{
        inactiveTintColor: color.light,
        activeTintColor: color.alpha,

        tabStyle: {},

        style: {
          borderTopWidth: 0,
          backgroundColor: '#312F2F'
        },
        labelStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: -32
        },
        iconStyle: {
          flex: 1
        }
      }}
    >
      <Tab.Screen
        name='home'
        component={Home}
        initialParams={route.params}
        options={{
          title: '',
          tabBarIcon: () => {
            return (
              <FontAwesomeIcon
                icon={faHome}
                style={{ color: color.light }}
                size={24}
              ></FontAwesomeIcon>
            )
          }
        }}
      />
      <Tab.Screen
        name='fy'
        component={Fy}
        options={{
          title: '',
          tabBarIcon: () => {
            return (
              <FontAwesomeIcon
                icon={faGlobeEurope}
                style={{ color: color.light }}
                size={24}
              ></FontAwesomeIcon>
            )
          }
        }}
      />
      <Tab.Screen
        name='+'
        component={Add}
        initialParams={route.params}
        options={{
          title: '',
          tabBarIcon: () => {
            return (
              <View
                style={{
                  backgroundColor: color.alpha,
                  padding: 12,
                  borderRadius: 12
                }}
              >
                <FontAwesomeIcon
                  icon={faPlus}
                  style={{ color: color.light }}
                  size={24}
                ></FontAwesomeIcon>
              </View>
            )
          }
        }}
      />
      <Tab.Screen
        name='map'
        component={Map}
        initialParams={route.params}
        options={{
          title: '',
          tabBarIcon: () => {
            return (
              <FontAwesomeIcon
                icon={faMapMarkedAlt}
                style={{ color: color.light }}
                size={24}
              ></FontAwesomeIcon>
            )
          }
        }}
      />
      <Tab.Screen
        name='user'
        component={User}
        initialParams={route.params}
        options={{
          title: '',
          tabBarIcon: () => {
            return (
              <FontAwesomeIcon
                icon={faUser}
                style={{ color: color.light }}
                size={24}
              ></FontAwesomeIcon>
            )
          }
        }}
      />
    </Tab.Navigator>
  )
}
