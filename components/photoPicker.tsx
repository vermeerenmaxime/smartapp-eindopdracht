import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import React from 'react'

import { TouchableOpacity } from 'react-native'

import { color } from '../styles/colors'
import { story } from '../styles/components/story'

const PhotoPicker = (props:any) => (
  <TouchableOpacity
    style={[story.articleImage, { backgroundColor: 'white' }]}
    onPress={props.onPress}
  >
    <FontAwesomeIcon icon={faPlus} size={24} color={color.lightGray} />
  </TouchableOpacity>
)

export default PhotoPicker
