import { StyleSheet } from 'react-native'
import { color } from './colors'

export const app = StyleSheet.create({
  container: {
    // paddingVertical: 16,
    paddingHorizontal: 32,

  },
  containerWelcome: {
    // flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollViewHorizontal: {
    marginRight: -32
  },
  label: {
    paddingHorizontal: 8,
    paddingVertical: 8
  },
  input: {
    fontSize: 16,
    fontFamily: 'Roboto',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 22,
    margin: 0,
    minWidth: '80%',
    marginVertical: 8,

    shadowColor: 'black',
    shadowOpacity: 0.06,
    shadowRadius: 25
  },
  button: {
    backgroundColor: color.alpha,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    // width: 150,
    marginVertical: 6,

    shadowColor: 'black',
    shadowOpacity: 0.05,
    elevation: 50,
    shadowRadius: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'Roboto',

    alignSelf: 'center'
  },
  buttonRed: { backgroundColor: color.red },
  signUp: {
    // width: "100%",
    textAlign: 'center',
    padding: 12

    // textDecoration:"underline",
  }
})
