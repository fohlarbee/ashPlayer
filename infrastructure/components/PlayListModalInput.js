import { StyleSheet, Text, View, Modal, TextInput, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react';
import {AntDesign} from "@expo/vector-icons";
import { Theme } from './Theme';

export default function PlayListModalInput({visible, onCloseModal, onSubmit}) {
    const [playlistName, setPlaylistName] = useState("");

    const handleOnSubmit = () => {
        if(playlistName === ""){
            onCloseModal();
        }
        else{
            setPlaylistName(playlistName)
        }
        // if(!playlistName){
        //     onCloseModal();
        // }else{
        //     onSubmit(playlistName);
        //     setPlaylistName("");
        //     onCloseModal();
        // }
    }
  return (
    <Modal visible={visible} animationType="fade" transparent>
        <View style={styles.modalContainer}>
            <View style={styles.inputContainer}>
                <Text style={{color:Theme.FONT}}>Create new Playlist</Text>
                <TextInput 
                // value={playlistName} 
                onchangeText={(text) => setPlaylistName(text)} 
                style={styles.input}/>
                <AntDesign
                 name='check' 
                 size={50}
                //  color={Theme.ACTIVE_BG}
                 style={styles.submitBtn}
                 onPress={handleOnSubmit}
                 />
            </View>
        </View>
        <TouchableOpacity 
        style={[StyleSheet.absoluteFillObject, styles.modalBg]} 
        onPress={onCloseModal}
        >

        </TouchableOpacity>
    </Modal>
  )
}

const {width} = Dimensions.get("window");
const styles = StyleSheet.create({
    modalContainer:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    inputContainer:{
        width:width - 20,
        height:200,
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center",
    },
    input:{
        width:width - 40,
        borderBottomColor:1,
        borderBottomColor:Theme.ACTIVE_BG,
        fontSize:18,
        paddingVertical:5,
        backgroundColor:"rgba(0,0,0,0.2)"

    },
    submitBtn:{
        padding:10,
        backgroundColor:Theme.ACTIVE_BG,
        borderRadius:50,
        marginTop:15,
    },
    modalBg:{
        color:Theme.MODAL_BG,
        zIndex:-1
    }
});