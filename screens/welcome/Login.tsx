import React, { useEffect, useState, useCallback } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Button,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppButton from "../../components/appButton";

import { app } from "../../styles/app";
import { header } from "../../styles/components/header";

import { firestore, firebase } from "../../database/firebase";
import { color } from "../../styles/colors";

const Login = ({ route, navigation }: any) => {
  const [email, setEmail] = useState("maxime6128@gmail.com");
  const [password, setPassword] = useState("Eeeeee");

  const [loading, setLoading] = useState(false);

  const userLogin = () => {
    if (email === "" && password === "") {
      Alert.alert("Enter details to signin!");
    } else {
      setLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((res: any) => {

          // console.log(res);
          console.log(
            "-- User successfully logged in : ",
            res.user.displayName
          );
          setLoading(false);
          setEmail("");
          setPassword("");
          navigation.navigate("TabNavigation", {
            // user: res.user,
          });
        })
        .catch((error) => {
          alert(error);
          setLoading(false);
        });
    }
  };
  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color={color.gray} />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={[app.container, app.containerWelcome]}>
        <View>
          <Text style={header.title}>Travler</Text>
          <Text style={app.label}>Login with your account</Text>
          <TextInput
            style={app.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email.."
          />
          <TextInput
            style={app.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Password.."
            secureTextEntry={true}
          />
          <Text style={app.label}>Forgot password</Text>
          <AppButton onPress={() => userLogin()} title="Login" />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            <Text style={app.signUp}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
};

export default Login;
