import React from 'react'

import { ActivityIndicator, View } from 'react-native'

import { app } from '../styles/app'
import { color } from '../styles/colors'

const Loader = () => (
  <View style={app.activityIndicator}>
    <ActivityIndicator size='large' color={color.gray} />
  </View>
)

export default Loader
