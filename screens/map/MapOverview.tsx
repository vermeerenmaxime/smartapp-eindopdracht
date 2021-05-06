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
  const getUserMarkers = async () => {
    // let stories: StoryModel[] = []
    await storiesRef
      .get()
      .then((query: any) => {
        query.forEach((doc: any) => {
          if (doc.data().latitude & doc.data().longitude) {
            let marker = {
              latitude: doc.data().lat,
              longitude: doc.data().long,
              title: doc.data().title,
              subtitle: doc.data().description,
              storyId: doc.id,
              color: doc.data().author == userData.uid ? 'green' : 'blue'
            }
            setMarkers([...markers, marker])
          }
        })
      })
      .catch((error: any) => {
        console.log('Error getting documents: ', error)
      })
  }

  useFocusEffect(
    useCallback(() => {
      getLocationAsync()
    }, [])
  )
  useEffect(() => {
    setLoading(true)
    getUserMarkers()
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
          {markers
            .filter(marker => marker.longitude && marker.latitude)
            .map((marker, index) => {
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
            })}
          {locationPermission && (
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude
              }}
              pinColor={'red'} // any color
              title={'Current location'}
              description={''}
            />
          )}
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
