import { StyleSheet } from "react-native";
import { color } from "../colors";

export const switchHeader = StyleSheet.create({
  header: {
    backgroundColor: color.black,
    width: "100%",
    borderRadius: 8,
    justifyContent: "space-around",
    flexDirection: "row",
    marginVertical: 16,
  },
  itemContainer: {
    flexDirection: "column",
  },
  itemText: {
    fontFamily: "RobotoBold",
    padding: 10,
    color: "white",
  },
  selected: {
    width: "100%",
    height: 4,
    backgroundColor: color.alpha,
    marginBottom: -2,
    borderRadius: 100,
  },
});
