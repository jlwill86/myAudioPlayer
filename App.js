import React, { useState } from "react";
// import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./app/navigation/AppNavigator";
import AudioProvider from "./app/context/AudioProvider";
import { View } from "react-native";
import AudioListItem from "./app/components/AudioListItem";

export default function App() {
  // const  [isModalVisible, setIsModalVisible] = useState(false);
  return <AudioProvider>
  <NavigationContainer>
    <AppNavigator />
  </NavigationContainer>
  </AudioProvider>
  // return (
  // <View style={{ marginTop: 50}}>
  //   <AudioListItem />
  // </View>

  // );
};