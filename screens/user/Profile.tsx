import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import ParallaxScrollView from "react-native-parallax-scroll-view";
// https://www.npmjs.com/package/react-native-parallax-scroll-view

// Inside of a component's render() method:
const Profile = ({ route, navigation }: any) => {
  return (
    <ParallaxScrollView
      backgroundColor="blue"

      outputScaleValue={5}
      stickyHeaderHeight={80}
      renderStickyHeader={() => (
        <SafeAreaView>
          <Text>hi</Text>
        </SafeAreaView>
      )}
      parallaxHeaderHeight={300}
      fadeOutForeground={true}
      renderForeground={() => (
        <View
          style={{
            height: 300,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Hello World!</Text>
        </View>
      )}
    >
      <View style={{ height: 500 }}>
        <Text>Scroll me</Text>
      </View>
    </ParallaxScrollView>
  );
};

export default Profile;
