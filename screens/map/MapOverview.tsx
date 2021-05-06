import * as React from 'react'
import MapView from 'react-native-map-clustering'

import { Marker } from 'react-native-maps'
import { View, Alert } from 'react-native'
import { useCallback, useEffect, useState } from 'react'

import * as Permissions from 'expo-permissions'
import * as Location from 'expo-location'

import { useFocusEffect } from '@react-navigation/native'
import { firestore } from '../../database/firebase'
import { userData } from '../../database/databaseContext'
import { map } from '../../styles/components/map'
import Loader from '../../components/loader'
import { MarkerModel } from '../../models/Marker'
import { RegionModel } from '../../models/Region'
import { useRef } from 'react'

const mapOverview = ({ route, navigation }: any) => {
  const [markers, setMarkers] = useState<MarkerModel[]>([])

  const [region, setRegion] = useState<RegionModel>({
    latitude: 50,
    longitude: 50,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  })

  const [loading, setLoading] = useState(true)
  const [locationPermission, setLocationPermission] = useState(false)

  const getGeolocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION)
    if (status !== 'granted') {
      Alert.alert('Cannot load map, permission is denied')
      setLocationPermission(false)
    } else {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest
      })
      const { latitude, longitude } = location.coords
      setRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.25,
        longitudeDelta: 0.15
      })
      setLocationPermission(true)
    }
  }

  const storiesRef = firestore.collection('story')
  const getUserMarkers = async () => {
    await storiesRef
      .get()
      .then((query: any) => {
        let markerArray: MarkerModel[] = []
        query.forEach((doc: any) => {
          if (
            doc.data().private == false ||
            (doc.data().private == true && doc.data().author == userData.uid)
          ) {
            if (doc.data().lat && doc.data().long) {
              let marker = {
                latitude: doc.data().lat,
                longitude: doc.data().long,
                title: doc.data().title,
                subtitle: doc.data().description,
                storyId: doc.id,
                color: doc.data().author == userData.uid ? 'green' : 'blue'
              }
              markerArray.push(marker)
            }
          }
        })
        setMarkers(markerArray)
      })
      .catch((error: any) => {
        console.log('Error getting documents: ', error)
      })
  }
  // const mapRef = useRef<any>(null)
  useFocusEffect(
    useCallback(() => {
      // if (route.params.region) {
      //   setRegion(route.params.region)
      //   if (loading == false) {
      //     mapRef.current.animateToRegion(region, 1000)
      //   }
      // }
      setLoading(true)
      getGeolocation()
      getUserMarkers()
      setLoading(false)
    }, [])
  )
  // useEffect(() => {}, [])

  if (loading) {
    return <Loader />
  } else {
    return (
      <View style={map.container}>
        <MapView
          style={map.map}
          initialRegion={region}
          // region={region}
          // showsMyLocationButton={true}
          // onRegionChange={data => {
          //   setRegion(data)
          // }}
          // ref={mapRef}
          showsCompass={true}
          showsUserLocation={true}
        >
          {markers &&
            markers.map((marker, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude
                  }}
                  pinColor={marker.color}
                  title={marker.title}
                  description={marker.subtitle}
                  onPress={() =>
                    navigation.navigate('Story', {
                      storyId: marker.storyId,
                      edit: false
                    })
                  }
                />
              )
            })}
          {/* {locationPermission && (
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude
              }}
              pinColor={'red'} // any color
              title={'Current location'}
              description={''}
            />
          )} */}
        </MapView>
      </View>
    )
  }
}

export default mapOverview
