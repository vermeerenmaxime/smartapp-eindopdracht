import * as React from 'react'
import MapView from 'react-native-map-clustering'
import { Marker } from 'react-native-maps'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  ActivityIndicator,
  SafeAreaView
} from 'react-native'
import { useCallback, useEffect, useState } from 'react'

import * as Permissions from 'expo-permissions'

import * as Location from 'expo-location'
import { useFocusEffect } from '@react-navigation/native'
import { color } from '../../styles/colors'
import { app } from '../../styles/app'
import { firestore } from '../../database/firebase'
import StoryModel from '../../models/Story'
import { userData } from '../../database/databaseContext'

const mapOverview = ({ route, navigation }: any) => {
  const [stories, setStories] = useState<StoryModel[]>()
  const [markers, setMarkers] = useState([
    {
      latitude: 50.86421388545356,
      longitude: 3.5698920355299366,

      title: 'Foo Place',
      subtitle: '1234 Foo Drive',
      storyId: 'DjbqmxkNqMUWqcMVoWz9',

      color: 'purple'
    },
    {
      latitude: 48.922499,
      longitude: 5.167022,

      title: 'belgie',
      subtitle: 'olalal',
      storyId: 'DjbqmxkNqMUWqcMVoWz9',

      color: 'purple'
    },
    {
      latitude: 37.78825,
      longitude: -122.4324,

      title: 'belgie',
      subtitle: 'olalal',
      storyId: 'DjbqmxkNqMUWqcMVoWz9',

      color: 'purple'
    }
  ])

  const [region, setRegion] = useState(
    route.params.region
      ? route.params.region
      : {
          latitude: 37.72825,
          longitude: -122.4324,
          latitudeDelta: 0.25,
          longitudeDelta: 0.15
        }
  )

  const [loading, setLoading] = useState(true)
  const [locationPermission, setLocationPermission] = useState(false)

  const getLocationAsync = async () => {
    setLoading(true)
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      Alert.alert('Cannot load map, permission is denied')
      setLocationPermission(false)
    } else {
      setLocationPermission(true)
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest
      })
      const { latitude, longitude } = location.coords
      // getGeocodeAsync({ latitude, longitude });

      setRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.25,
        longitudeDelta: 0.15
      })
    }
    setLoading(false)
  }

  const storiesRef = firestore.collection('story')
  const getUserStories = async () => {

    let stories: StoryModel[] = []
    await storiesRef
      .where('author', '==', userData.uid)
      .get()
      .then(query => {
        query.forEach(doc => {
          let newStory: StoryModel = {
            id: doc.id,
            title: doc.data().title,
            image: doc.data().image,
            private: doc.data().private,
            author: doc.data().author,
            description: doc.data().description,
            likes: doc.data().likes,
            lat: doc.data().lat,
            long: doc.data().long
          }
          let marker = {
            latitude: doc.data().lat,
            longitude: doc.data().long,
            title: doc.data().title,
            subtitle: doc.data().description,
            storyId: doc.id,
            color: 'green'
          }
          setMarkers([...markers, marker])
          stories.push(newStory)
        })
        setStories(stories)
      })
      .catch((error: any) => {
        console.log('Error getting documents: ', error)
      })
    // return stories
  }

  useFocusEffect(
    useCallback(() => {
      getLocationAsync()
    }, [])
  )
  useEffect(() => {
    setLoading(true)
    getUserStories()
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <View style={app.activityIndicator}>
        <ActivityIndicator size='large' color={color.gray} />
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <MapView style={styles.map} initialRegion={region}>
          {markers.map((marker, index) => {
            if (marker.longitude && marker.latitude) {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude
                  }}
                  pinColor={marker.color} // any color
                  title={marker.title}
                  description={marker.subtitle}
                  onPress={() =>
                    navigation.navigate('Story', {
                      // storyId: 'DjbqmxkNqMUWqcMVoWz9',
                      storyId: marker.storyId,
                      edit: false
                    })
                  }
                />
              )
            }
          })}
          {locationPermission ? (
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude
              }}
              pinColor={'red'} // any color
              title={'Current location'}
              description={''}
              // onPress={() => navigation.navigate("AddStory", {})}
              // press={console.log("hi")}
            />
          ) : null}
        </MapView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
})
export default mapOverview
