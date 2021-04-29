import React from 'react'

import { ImageBackground, Text, TouchableOpacity } from 'react-native'
import { app } from '../styles/app'
import { story } from '../styles/components/story'

const showNotifications = () => {}

const StorySmall = ({ title, onPress, image }: any) => (
  <TouchableOpacity style={story.small} onPress={onPress}>
    <ImageBackground
      source={{ uri: image }}
      style={story.smallImage}
    >
      <Text style={story.smallText}>{title}</Text>
    </ImageBackground>
  </TouchableOpacity>
)

export default StorySmall
