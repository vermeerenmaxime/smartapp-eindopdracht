import { StyleSheet } from 'react-native'
import { color } from '../colors'

export const story = StyleSheet.create({
  big: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    height: 80,
    width: '100%',
    borderRadius: 12,

    marginBottom: 8,

    shadowColor: 'black',
    shadowOpacity: 0.15,
    elevation: 25,
    shadowRadius: 25,

    overflow: 'hidden'
  },
  small: {
    marginRight: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    height: 100,
    width: 140,
    borderRadius: 12,

    shadowColor: 'black',
    shadowOpacity: 0.15,
    elevation: 25,
    shadowRadius: 25,

    overflow: 'hidden'
  },
  smallImage: {
    width: '100%',
    height: '100%',
    overflow: 'hidden'
  },
  smallText: {
    padding: 8,
    color: 'white',
    fontFamily: 'RobotoBold',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  bigText: {
    fontSize: 18,
    padding: 16,
    color: 'white',
    fontFamily: 'RobotoMedium'
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: 'red'
    // justifyContent:"space-around",
  },
  author: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold'
    // paddingBottom: 6,
    // paddingTop: 12,
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
    transform: [{ rotate: '-135deg' }],

    shadowColor: 'black',
    shadowOpacity: 0.15,
    elevation: 50,
    shadowRadius: 50,
    marginLeft: 32
    // marginBottom:-24,
  },
  avatarImage: {
    borderRadius: 50,
    resizeMode: 'stretch',
    width: '100%',
    height: '100%',
    transform: [{ rotate: '135deg' }]
  },
  title: {
    fontSize: 14,
    fontFamily: 'RobotoBold'
  },
  likes: {
    flexDirection: 'row',
    paddingTop: 16
  },
  likesText: {
    fontSize: 12,
    color: color.lightGray,
    marginLeft: 6
  },
  likesIcon: {
    color: color.red
  },
  like: {
    right: 0,
    bottom: 0,
    position: 'absolute',
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  likeIcon: {
    color: 'white'
  },
  editIcon: {
    color: 'black',
    padding: 8,
    backgroundColor: color.light,
    borderRadius: 100,
    marginLeft: 'auto'
  },
  linearGradient: {
    overflow: 'visible',
    height: '100%',
    alignItems: 'flex-end',
    flexDirection: 'row'
  },
  articleImages: {
    marginTop: 12,
    marginBottom: 12
  },
  articleImage: {
    backgroundColor: 'black',
    height: 75,
    width: 75,
    marginRight: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  }
})
