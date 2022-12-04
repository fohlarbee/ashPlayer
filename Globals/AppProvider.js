import { Alert, Text, View, StyleSheet } from 'react-native'
import React, { Component, createContext } from 'react'
import * as MediaLibrary from 'expo-media-library';
import { DataProvider } from 'recyclerlistview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { storeAudioForNextOpening } from '../infrastructure/components/Helper,';
import { playNext } from '../infrastructure/components/AudioContoller';
 

 export const AudioContext = createContext();

export class AppProvider extends Component {
    //   {"canAskAgain": true, "expires": "never", "granted": false, "status": "denied"}
    constructor(props){
        super(props)
        this.state={
            audioFiles:[],
            playlist:[],
            addToPlaylist:null,
            permissionError:false,
            dataProvider: new DataProvider((r1, r2) => r1 !== r2),
            playbackObj:null,
            soundObj:null,
            currentAudio:{},
            isPlaying:false,
            currentAudioIndex:null,
            playbackPosition:null,
            playbackDuration:null
        }
        this.totalAudioCount = 0
    }
    //permission alert
    permissionAlert(){
        Alert.alert("Audio permission Needed", "Permission is needed to use this app", [
            {text:"Try again", onPress:() => this.getPermission()},
            {text:"cancel", onPress:() => this.permissionAlert()}
        ])
    }
    /////////////////

    ////get Audio files
    getAudioFiles = async () => {
        const {dataProvider, audioFiles} = this.state
       let media = await MediaLibrary.getAssetsAsync({
            mediaType:"audio"
        });
        media = await MediaLibrary.getAssetsAsync({
            mediaType:"audio",
            first:media.totalCount,
        });
        this.totalAudioCount = media.totalCount
        this.setState({...this.state,dataProvider:dataProvider.cloneWithRows([...audioFiles, ...media.assets]), 
            audioFiles:[...audioFiles, ...media.assets]})
    }
    ///////

    loadPreviousAudio = async () => {
        ///render the last played audio
        let previousAudio = await AsyncStorage.getItem("previousAudio");
        let currentAudio;
        let currentAudioIndex;

        if(previousAudio === null){
            currentAudio = this.state.audioFiles[0];
            currentAudioIndex = 0;
        }else{
            previousAudio = JSON.parse(previousAudio);
            currentAudio = previousAudio.audio;
            currentAudioIndex = previousAudio.index;
        }
        this.setState({...this.state, currentAudio, currentAudioIndex});
    }

     getPermission = (async () => {
        const permission = await MediaLibrary.getPermissionsAsync();
        if(permission.granted) {
            // we want to grap all audio files
            this.getAudioFiles();
        }
        if(!permission.canAskAgain && !permission.granted) {
            this.setState({...this.state, permissionError:true})
 
        }
        if(!permission.granted && permission.canAskAgain) {
            // we want to request permission
            const {status, canAskAgain} = await MediaLibrary.requestPermissionsAsync();
            if(status === "denied" && canAskAgain) {
                // display an alert to user that permission access is needed to 
                // run the app
                this.permissionAlert();
            }
            if(status === "granted"){
                // we want to grap all audio files
                // this.getAudioFiles();
            }
            if(status === "denied" && !canAskAgain) {
                // we display an error to the user
                this.setState({...this.state, permissionError:true})
            }
        }
    });

    onPlaybackStatusUpdate = async(playbackStatus) => {
        if(playbackStatus.isLoaded && playbackStatus.isPlaying){
          this.updateState(this, {
            playbackPosition: playbackStatus.positionMillis,
            playbackDuration: playbackStatus.durationMillis,
          })
        }
        if(playbackStatus.didJustFinish){
          const nextAudioIndex = this.state.currentAudioIndex + 1;
          //the current audio is the last or there is no audio to play
          if(nextAudioIndex >= this.totalAudioCount){
            this.state.playbackObj.onloadAsync();
            this.updateState(this, {
              soundObj:null,
              currentAudio:this.state.audioFiles[0],
              isPlaying:false,
              currentAudioIndex:0,
              playbackPosition:null,
              playbackDuration:null
    
            });
             return await storeAudioForNextOpening(this.state.audioFiles[0], 0); 
    
            
          };
        
          ///otherwise it select next audio
          const nextAudio =  this.state.audioFiles[nextAudioIndex]
          const status = await playNext(this.state.playbackObj, nextAudio.uri)
          this.updateState(this, {
            soundObj:status,
            currentAudio:nextAudio,
            currentAudioIndex:nextAudioIndex,
            isPlaying:true
          });
          await storeAudioForNextOpening(nextAudio, nextAudioIndex); 
        }
      }

    componentDidMount(){
        this.getPermission();
        if(this.state.playbackObj === null){
            this.setState({...this.state, playbackObj: new Audio.Sound()});
        }
    }

    updateState = (prevState, newState ={}) => {
        this.setState({...prevState, ...newState})
    }
  render() {
    const {dataProvider, 
        audioFiles, 
        playlist,
        addToPlaylist,
        permissionError, 
        playbackObj, 
        soundObj, 
        currentAudio, 
        isPlaying,
        currentAudioIndex,
        playbackPosition,
        playbackDuration
    } = this.state
    if(permissionError){
        return <View style={styles.permissionErorrHolder}>
            <Text style={styles.permissionErorrText}>seems like you haven't accepted the permission</Text>
        </View>
    }
    return (
        <AudioContext.Provider value={{
            audioFiles, 
            playlist,
            addToPlaylist,
            dataProvider,
            playbackObj,
            soundObj,
            currentAudio,
            updateState:this.updateState,
            isPlaying,
            currentAudioIndex,
            playbackPosition,
            playbackDuration,
            totalAudioCount: this.totalAudioCount,
            loadPreviousAudio: this.loadPreviousAudio,
            onPlaybackStatusUpdate:this.onPlaybackStatusUpdate
            }}>
            {this.props.children}
        </AudioContext.Provider>
    )
  }
}
const styles = StyleSheet.create({
    permissionErorrHolder:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    permissionErorrText:{
        fontSize:60,
        color:"red",
        textAlign:"center"
    }
})

export default AppProvider