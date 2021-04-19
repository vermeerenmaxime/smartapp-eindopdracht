import * as React from "react";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useCallback, useEffect, useState } from "react";

import * as Permissions from "expo-permissions";

import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";

const mapOverview = ({ route, navigation }: any) => {
  const [markers, setMarkers] = useState([
    {
      latitude: 50.86421388545356,
      longitude: 3.5698920355299366,

      title: "Foo Place",
      subtitle: "1234 Foo Drive",
    },
    {
      latitude: 48.922499,
      longitude: 5.167022,

      title: "belgie",
      subtitle: "olalal",
    },
    {
      latitude: 37.78825,
      longitude: -122.4324,

      title: "belgie",
      subtitle: "olalal",
    },
  ]);

  const [region, setRegion] = useState({
    latitude: 37.72825,
    longitude: -122.4324,
    latitudeDelta: 0.25,
    longitudeDelta: 0.15,
  });

  const [loading, setLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState(false);

  const getLocationAsync = async () => {
    setLoading(true);
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      Alert.alert("Cannot load map, permission is denied");
      setLocationPermission(false);
    } else {
      setLocationPermission(true);
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });
      const { latitude, longitude } = location.coords;
      // getGeocodeAsync({ latitude, longitude });

      // console.log({ location: { latitude, longitude } });
      setRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.25,
        longitudeDelta: 0.15,
      });
      // console.log("region", region);
    }
    setLoading(false);
  };

  const getGeocodeAsync = async (location: any) => {
    let geocode = await Location.reverseGeocodeAsync(location);
    // this.setState({ geocode });
    console.log("geocode:", geocode);
    // setInitialRegion({ latitude:geocode.latitude, longitude });
  };
  useFocusEffect(
    useCallback(() => {
      getLocationAsync();
    }, [])
  );
  // useEffect(() => {
  //   getLocationAsync();
  // });
  if (!loading) {
    return (
      <View style={styles.container}>
        <MapView style={styles.map} initialRegion={region}>
          {markers.map((marker, index) => {
            // console.log(index);
            return (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                pinColor={"purple"} // any color
                title={marker.title}
                description={marker.subtitle}
                onPress={() =>
                  navigation.navigate("Story", {
                    storyId: "DjbqmxkNqMUWqcMVoWz9",
                    edit: false,
                  })
                }
                // press={console.log("hi")}
              />
            );
          })}
          {locationPermission ? (
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
              pinColor={"red"} // any color
              title={"Current location"}
              description={""}
              // onPress={() => navigation.navigate("AddStory", {})}
              // press={console.log("hi")}
            />
          ) : null}
        </MapView>
      </View>
    );
  } else {
    return <ActivityIndicator></ActivityIndicator>;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
export default mapOverview;
