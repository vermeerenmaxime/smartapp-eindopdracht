import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";

import { Text, TouchableOpacity, View } from "react-native";
import { story } from "../styles/components/story";
import { subtitle } from "../styles/components/subTitle";

const SubTitle = ({ title, edit, props, onPress }: any) => (
  <View style={subtitle.container}>
    <View style={subtitle.stroke}></View>
    <Text style={subtitle.text}>{title}</Text>
    {edit ? (
      <TouchableOpacity style={story.editIcon} onPress={onPress}>
        <FontAwesomeIcon icon={faPencilAlt} size={12} />
      </TouchableOpacity>
    ) : null}
  </View>
);

export default SubTitle;
