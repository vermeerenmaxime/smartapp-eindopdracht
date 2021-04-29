import React from 'react'

import {
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
  TextInput,
  Vibration
} from 'react-native'
import { app } from '../styles/app'

const AppButton = ({ onPress, title, style, red }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[app.button, style, red && app.buttonRed]}
  >
    <Text style={app.buttonText}>{title}</Text>
  </TouchableOpacity>
)

export default AppButton
