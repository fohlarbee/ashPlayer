import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Theme } from '../components/Theme'
import PlayListModalInput from '../components/PlayListModalInput'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AudioContext } from '../../Globals/AppProvider';
import PlayListDetails from '../components/PlayListDetails';

let selectedPlayList = {}; 

export const PlayList = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const context = useContext(AudioContext);
  const {playlist, addToPlaylist, updateState} = context;
  const [showPlayList, setShowPlayList] = useState(false);

  const createPlaylist = async playlistName => {
    const result = await AsyncStorage.getItem("playlist");
    if(result !== null){
      const audios = [];
      if(addToPlaylist){
        audios.push(addToPlaylist);
      }
      const newList = {
        id: Date.now(),
        title:playlistName,
        audios: audios
      }
      const updatedList = [...playlist, newList];
      updateState(context, {
        addToPlaylist:null, 
        playlist:updatedList,
      });
      await AsyncStorage.setItem("playlist", JSON.stringify(updatedList));
    }
    setModalVisible(false);
  };

  const renderPlaylist = async() => {
    const result = await AsyncStorage.getItem("plalist");
    if(result === null){
      const defaultPlaylist = {
        id: Date.now(),
        title:"My Favourite",
        audios:[],
      }
      const newPlaylist = [...playlist, defaultPlaylist];
      updateState(context, {playlist:[...newPlaylist]});
      return await AsyncStorage.setItem("playlist", JSON.stringify([...newPlaylist]));
    }
    updateState(context, {playlist:JSON.parse(result)});
  }

  useEffect(() => {
    if(!playlist.length){
      renderPlaylist();
    }
  },[] )
  const handleBannerPress = async(playlist) => {
    if(addToPlaylist){
      const result = await AsyncStorage.getItem("playlist");
      let oldList = [];
      let updatedList = [];
      let sameAudio = false

      if(result !== null){
        oldList = JSON.parse(result);

        updatedList = oldList.filter(list => {
          //we want to check if the same audio is already inside our list

          if(list.id === playlist.id){
            for(let audio of list.audios){
              if(audio.id === addToPlaylist.id){
                //alert with some message
                sameAudio = true;
                return;

              }
            }
            //update playlist if there is any selected audio
            list.audios = [...list.audios, addToPlaylist]

          }
          return list;
          
        })
      }
      if(sameAudio){
        Alert.alert("Found same Audio!", `${addToPlaylist.filename} is already inside the list`);
        sameAudio = false;
        return updateState(context, {addToPlaylist: null});
         
      }
      updateState(context, {addToPlaylist:null, playlist:[...updatedList]});
      return AsyncStorage.setItem("playlist", JSON.stringify([...updatedList]))
    }

    //if there's no audio selected then we want to open the list
    selectedPlayList = playlist;    
    showPlayList(true)
  };
  return (
    <>
        <ScrollView contentContainerStyle={styles.container}>
            
            {playlist.length ? playlist.map(item => (
                <TouchableOpacity 
                key={item.id.toString()} 
                style={styles.playlistBanner}
                onPress={() => handleBannerPress(item)}
                >
                <Text>{item.title}</Text>
                <Text style={styles.audioCount}>{item.audios.length > 1 ?
                  `${item.audios.length}Songs`
                   :
                  `${item.audios.length}Song`
                }</Text>
            </TouchableOpacity>
            )) 
                
            : null}
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{marginTop:15}}>
                <Text style={styles.playlistBtn}>+ Add new playlist</Text>
            </TouchableOpacity>
            <PlayListModalInput 
            visible={modalVisible} 
            onCloseModal={() => setModalVisible(false)}
            onSubmit={createPlaylist}
            />
        </ScrollView>
        <PlayListDetails 
        visible={showPlayList} 
        playlist={selectedPlayList}
        onClose={() => setShowPlayList(false)}
        />
    </>
  )
}

const styles = StyleSheet.create({
    container:{
      padding:20
    },
    playlistBanner:{
      padding:5,
      backgroundColor:"rgba(204,204,204,0.3)",
      borderRadius:5,
      marginBottom:15

    },
    audioCount:{
      marginTop:3,
      opacity:0.6,
      fontSize:15
    },
    playlistBtn:{
      color:Theme.ACTIVE_BG,
      letterSpacing:1,
      fontWeight:"bold",
      fontSize:14,
      padding:5
    }
})