import * as React from "react";
import MapView from "react-native-map-clustering";
import { Marker } from "react-native-maps";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { useState } from "react";

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

  const initialRegion = {
    latitude: 37.72825,
    longitude: -122.4324,
    latitudeDelta: 0.25,
    longitudeDelta: 0.15,
  };
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={initialRegion}>
        {markers.map((marker, index) => {
          console.log(index);
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
      </MapView>
    </View>
  );
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
