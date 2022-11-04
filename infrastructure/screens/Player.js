import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export const Player = () => {
  return (
    <View style={styles.container}>
      <Text>Player</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    }
})