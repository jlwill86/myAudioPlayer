import { View, Text, Image, Button, ScrollView, Pressable, Modal } from "react-native";
import React, { useState } from "react";
const logoImg = require("./assets/Copy of The Sports and culture network (2560 × 1440 px).png");

export default function App() {
  const  [isModalVisible, setIsModalVisible] = useState(false);
  return <View style={{ flex: 1, backgroundColor: "lightblue", padding: 60}}>
     <ScrollView>
     <Button title='My Account' onPress={() => setIsModalVisible(true)} 
      color={"midnightblue"} 
      disabled={false}/>
     
      

      
      
      <Modal visible={isModalVisible} onRequestClose={() => setIsModalVisible(false)} animationType="slide" presentationStyle="pageSheet">
        <View style={{ flex: 1, backgroundColor: "lightgrey", padding:60}}>
          <Text>Modal Content</Text>
          <Button title="Close" onPress={() => setIsModalVisible(false)} />
          <Pressable onPress={() => console.log("Image Pressed")}>
      <Image source={logoImg} style={{ width: 300, height: 300, marginTop: 40 }} />
      </Pressable>
        </View>
        </Modal> 
        
      </ScrollView>
    </View>
  
};