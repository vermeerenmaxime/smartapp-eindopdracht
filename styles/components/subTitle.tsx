import { StyleSheet } from "react-native";
import { color } from "../colors";

export const subtitle = StyleSheet.create({
  container: {
    paddingVertical: 16,
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    paddingLeft: 8,
    fontFamily: "RobotoBold",
    fontSize: 16,
    fontWeight: "600",
    color: color.black,
    // justifySelf: "flex-start",
  },
  stroke: {
    width: 4,
    height: 24,
    backgroundColor: color.alpha,
    borderRadius: 50,
  },
});
