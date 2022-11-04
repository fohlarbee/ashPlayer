import { Modal, StatusBar, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import { Theme } from './Theme'

export const OptionModal = ({visible, onClose, currentItem,onPlaylistPress,onPlayPress}) => {
    const {filename} = currentItem
  return (
    <>
        <StatusBar hidden/>

        <Modal animationType='slide' visible={visible} transparent>
            <View style={styles.modal}>
                <Text numberOfLines={2} style={styles.title}>{filename}</Text>
                <View style={styles.optionContainer}>
                    <TouchableWithoutFeedback onPress={onPlayPress}>
                        <Text style={styles.option}>Play</Text>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={onPlaylistPress}>
                         <Text style={styles.option}>Add to PlayList</Text>
                    </TouchableWithoutFeedback>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={onClose}>
                 <View style={styles.modalBg}/>    
            </TouchableWithoutFeedback>

        </Modal>
    </>
  )
}


const styles = StyleSheet.create({
    modal:{
        position:"absolute",
        bottom:0,
        right:0,
        left:0,
        backgroundColor:Theme.APP_BG,
        borderTopRightRadius:20,
        borderTopLeftRadius:20,
        zIndex:5000
        
    },
    optionContainer:{
        padding:20
    },
    title:{
        fontSize:18,
        fontWeight:"bold",
        padding:20,
        paddingBottom:0,
        color:Theme.FONT_MEDIUM
    },
    option:{
        fontSize:16,
        fontWeight:"bold",
        color:Theme.FONT_LIGHT,
        paddingVertical:10,
        letterSpacing:1 
    },
    modalBg:{
        position:"absolute",
        backgroundColor:Theme.MODAL_BG,
        bottom:0,
        right:0,
        left:0,
        top:0
    }
})