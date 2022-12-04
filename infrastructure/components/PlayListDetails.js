import { Dimensions, FlatList, Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Theme } from './Theme';
import { AudioListItem } from './AudioListItem';

export default function PlayListDetails({visible, playlist, onClose}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <View style={styles.container}>
            <Text style={styles.title}>{playlist.title}</Text>
            <FlatList 
            contentContainerStyle={styles.listContainer}
            data={playlist.audios} 
            keyExtractor={item =>item.id.toString()}
            renderItem={({item}) => ( 
                <View style={{marginBottom:10}} >
                     <AudioListItem title={item.title} duration={item.duration}/>
                </View>
             )}
            />
        </View>
        <View style={[StyleSheet.absoluteFillObject, styles.modalBg]}/>
    </Modal>
  )
}
const {width, height} = Dimensions.get("window");
const styles = StyleSheet.create({
     container:{
        position:"absolute",
        bottom:0,
        alignSelf:"center",
        height:height -150,
        width:width - 15,
        backgroundColor:"#fff",
        borderTopLeftRadius:50,
        borderTopRightRadius:50
     },
     modalBg:{
        backgroundColor:Theme.MODAL_BG,
        zIndex:-1
     },
     listContainer:{
        padding:20,
     },
     title:{
        textAlign:"center",
        fontSize:20,
        paddingVertical:5,
        fontWeight:"bold",
        color:Theme.ACTIVE_BG
     }
});