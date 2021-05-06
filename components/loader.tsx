import React from 'react'

import { ActivityIndicator, View } from 'react-native'
import { color } from 'react-native-reanimated'
import { app } from '../styles/app'

const Loader = () => (
  <View style={app.activityIndicator}>
    <ActivityIndicator size='large' color={color.gray} />
  </View>
)

export default Loader
