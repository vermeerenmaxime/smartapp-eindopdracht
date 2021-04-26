import React, { useState } from 'react'

import { Text, View, TouchableOpacity } from 'react-native'
import { switchHeader } from '../styles/components/switchHeader'

const SwitchHeader = ({ props, navigation, selected, onPress }: any) => {

  return (
    <View style={switchHeader.header}>
      <TouchableOpacity
        style={switchHeader.itemContainer}
        onPress={() => navigation.navigate('AddArticle')}
      >
        <Text style={switchHeader.itemText}>Add to trip</Text>
        {selected ? <View style={switchHeader.selected}></View> : null}
      </TouchableOpacity>
      <TouchableOpacity style={switchHeader.itemContainer}>
        <Text
          style={switchHeader.itemText}
          onPress={() => navigation.navigate('AddStory')}
        >
          Create new trip
        </Text>
        {!selected ? <View style={switchHeader.selected}></View> : null}
      </TouchableOpacity>
    </View>
  )
}

export default SwitchHeader
