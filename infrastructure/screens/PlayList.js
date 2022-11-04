import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export const PlayList = () => {
  return (
    <View style={styles.container}>
      <Text>PlayList</Text>
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