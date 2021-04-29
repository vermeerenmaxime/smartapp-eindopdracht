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
import { firebase, firestore } from '../database/firebase'
import UserModule from '../models/User'

function Fy ({}) {
  return <Text>fy</Text>
}
// function Map({}) {
//   return <Text>fy</Text>;
// }

function CustomTabBar ({ navigation, state, position }: any) {
  return (
    <View style={navigationBottom.TabBarMainContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Overview')}
        activeOpacity={0.6}
        style={navigationBottom.button}
      >
        <Ionicons name='book' size={12} color='white' />
        <Text style={navigationBottom.TextStyle}>home </Text>
      </TouchableOpacity>

      <TouchableOpacity
        // onPress={() => {navigation.navigate("Fy")}}
        onPress={() => console.log('test')}
        activeOpacity={0.6}
        style={navigationBottom.button}
      >
        <Ionicons name='globe' size={12} color='white' />
        <Text style={navigationBottom.TextStyle}>fy</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('MainNavigation', { screen: 'Add' })}
        activeOpacity={0.6}
        style={navigationBottom.buttonAdd}
      >
        <Text style={navigationBottom.buttonAddTextStyle}> + </Text>
      </TouchableOpacity>

      {/*
      <TouchableOpacity
        onPress={props.navigation.navigate("TabNavigation", { screen: "Map" })}
        activeOpacity={0.6}
        style={styles.button}
      >
        <Ionicons name="compass" size="12" color="white" />

        <Text style={styles.TextStyle}>map</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={props.navigation.navigate("TabNavigation", { screen: "User" })}
        activeOpacity={0.6}
        style={styles.button}
      >
        <Text style={styles.TextStyle}>me</Text>
      </TouchableOpacity> */}
    </View>
  )
}

export default function MainNavigation ({ route, navigation }: any) {
  return (
    <Tab.Navigator
      // tabBar={(props) => <CustomTabBar {...props} />}
      // screenOptions={customTabOptions}
      tabBarOptions={{
        inactiveTintColor: color.light,
        activeTintColor: color.alpha,

        tabStyle: {},
        safeAreaInsets: {
          //bottom:0
        },
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
          tabBarIcon: ({ size, focused }) => {
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
          tabBarIcon: ({ size, focused }) => {
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
          tabBarIcon: ({ size, focused }) => {
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
          tabBarIcon: ({ size, focused }) => {
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
          tabBarIcon: ({ size, focused }) => {
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
