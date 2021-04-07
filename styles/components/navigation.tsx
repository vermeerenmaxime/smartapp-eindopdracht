import { StyleSheet } from "react-native";

export const navigationBottom = StyleSheet.create({
  TabBarMainContainer: {
    justifyContent: "space-between",
    height: 64,
    flexDirection: "row",
    paddingHorizontal: 8,
    width: "100%",
    backgroundColor: "#312F2F",
    fontFamily:"Roboto",
  },

  button: {
    height: 64,
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  buttonAdd: {
    paddingHorizontal: 18,
    marginTop: -8,

    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#59D999",
    borderWidth: 3,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 24,
  },
  buttonAddTextStyle: {
    fontSize: 24,
    color: "white",
  },

  TextStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
