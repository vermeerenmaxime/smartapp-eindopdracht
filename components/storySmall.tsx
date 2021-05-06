import React from 'react'

import { ImageBackground, Text, TouchableOpacity } from 'react-native'
import { app } from '../styles/app'
import { color } from '../styles/colors'
import { story } from '../styles/components/story'

const StorySmall = ({ title, onPress, image, selected }: any) => (
  <TouchableOpacity
    style={[
      story.small,
      selected && { borderWidth: 3, borderColor: color.alpha }
    ]}
    onPress={onPress}
  >
    <ImageBackground source={{ uri: image }} style={story.smallImage}>
      <Text style={story.smallText}>{title}</Text>
    </ImageBackground>
  </TouchableOpacity>
)

export default StorySmall
