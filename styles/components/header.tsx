import { StyleSheet } from 'react-native'
import { color } from '../colors'

export const header = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 64,
    fontFamily: 'RobotoBold',
    fontWeight: 'bold'
  },
  avatar: {
    height: 56,
    width: 56,
    backgroundColor: 'white',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 5,
    borderWidth: 5,
    borderColor: 'white',
    transform: [{ rotate: '45deg' }],

    shadowColor: 'black',
    shadowOpacity: 0.15,
    elevation: 50,
    shadowRadius: 50
  },
  avatarImage: {
    borderRadius: 50,
    resizeMode: 'stretch',
    transform: [{ rotate: '-45deg' }],
    width: '100%',
    height: '100%',
    backgroundColor: 'red'
  },
  notificationCircle: {
    borderRadius: 50,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    height: 24,
    width: 24,
    backgroundColor: color.alpha,
    position: 'absolute',

    // alignItems:"flex-end",
    marginTop: -16,
    marginLeft: 12,

    flexShrink: 0,

    shadowColor: 'black',
    shadowOpacity: 0.15,
    elevation: 15,
    shadowRadius: 15,

    transform: [{ rotate: '-45deg' }]
  },
  notificationCircleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'RobotoBold'
  }
})
