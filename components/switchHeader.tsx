import React from "react";

import { Text, View, TouchableOpacity } from "react-native";
import { switchHeader } from "../styles/components/switchHeader";

const SwitchHeader = ({ props, selected }: any) => {
  const { navigation } = props;
  return (
    <View style={switchHeader.header}>
      <TouchableOpacity
        style={switchHeader.itemContainer}
        onPress={() => navigation.navigate("AddArticle")}
      >
        <Text style={switchHeader.itemText}>Add to existing</Text>
        {selected ? <View style={switchHeader.selected}></View> : null}
      </TouchableOpacity>
      <TouchableOpacity style={switchHeader.itemContainer}>
        <Text style={switchHeader.itemText}>Create new story</Text>
        {!selected ? <View style={switchHeader.selected}></View> : null}
      </TouchableOpacity>
    </View>
  );
};

export default SwitchHeader;
