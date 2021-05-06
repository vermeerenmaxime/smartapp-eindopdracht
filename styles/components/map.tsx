import { Dimensions, StyleSheet } from 'react-native'
import { color } from '../colors'

export const map = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.light,
    alignItems: 'center',
    justifyContent: 'center'
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})
