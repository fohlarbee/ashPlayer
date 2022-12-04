import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { Theme } from './Theme';
import { AntDesign } from '@expo/vector-icons';

export const PlayerButton = (props) => {
    const {
        iconType,
        size = 40, 
        iconColor=Theme.FONT, 
        onPress
    } = props

    const getIconName = (type) => {
        switch(type){
            case "PLAY":
                return "pausecircle"
            case "PAUSE":
                return "playcircleo"
            case "NEXT":
                return "forward"
            case "PREV":
                return "banckward"
        }
    }
  return (
    <AntDesign name={getIconName(iconType)} size={size} color={iconColor} onPress={onPress} {...props}/>
  )
}

 
const styles = StyleSheet.create({})