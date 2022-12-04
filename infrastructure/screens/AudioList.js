import { Text, View, StyleSheet, ScrollView, Dimensions } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../../Globals/AppProvider'
import {RecyclerListView, LayoutProvider} from "recyclerlistview"
import { AudioListItem } from '../components/AudioListItem'
import FocusedStatusBar from '../components/FocusedStatusBar'
import { Theme } from '../components/Theme'
import { OptionModal } from '../components/OptionModal'
import { Audio } from 'expo-av';
import { pause, play, playNext, resume, selectAudio } from '../components/AudioContoller';
import { storeAudioForNextOpening } from '../components/Helper,'

export class AudioList extends Component {
  static contextType = AudioContext
  constructor(props){
    super(props);
    this.state={
      OptionModalVisible: false,
     
    };
    this.currentItem={

    }
  }
  componentDidMount(){
    this.context.loadPreviousAudio();
  }

  // onPlaybackStatusUpdate = async(playbackStatus) => {
  //   if(playbackStatus.isLoaded && playbackStatus.isPlaying){
  //     this.context.updateState(this.context, {
  //       playbackPosition: playbackStatus.positionMillis,
  //       playbackDuration: playbackStatus.durationMillis,
  //     })
  //   }
  //   if(playbackStatus.didJustFinish){
  //     const nextAudioIndex = this.context.currentAudioIndex + 1;
  //     //the current audio is the last or there is no audio to play
  //     if(nextAudioIndex >= this.context.totalAudioCount){
  //       this.context.playbackObj.onloadAsync();
  //       this.context.updateState(this.context, {
  //         soundObj:null,
  //         currentAudio:this.context.audioFiles[0],
  //         isPlaying:false,
  //         currentAudioIndex:0,
  //         playbackPosition:null,
  //         playbackDuration:null

  //       });
  //        return await storeAudioForNextOpening(this.context.audioFiles[0], 0); 

        
  //     };
    
  //     ///otherwise it select next audio
  //     const nextAudio =  this.context.audioFiles[nextAudioIndex]
  //     const status = await playNext(this.context.playbackObj, nextAudio.uri)
  //     this.context.updateState(this.context, {
  //       soundObj:status,
  //       currentAudio:nextAudio,
  //       currentAudioIndex:nextAudioIndex,
  //       isPlaying:true
  //     });
  //     await storeAudioForNextOpening(nextAudio, nextAudioIndex); 
  //   }
  // }
  handleAudioPress = async(audio) => {
    await selectAudio(audio, this.context)
    // const {playbackObj, soundObj, currentAudio, updateState, audioFiles} = this.context
    // ///play audio for the first time
    // if(soundObj === null){
    //   const playbackObj = new Audio.Sound();
    //   const status = await play(playbackObj, audio.uri);
    //   const index = audioFiles.indexOf(audio)
    //   // console.log("here",index)
    //     updateState(this.context,
    //      {
    //       playbackObj:playbackObj,
    //       currentAudio:audio,
    //       soundObj:status,
    //       isPlaying:true,
    //       currentAudioIndex: index

    //     })
    //      playbackObj.setOnPlaybackStatusUpdate(this.context.onPlaybackStatusUpdate)
    //      return storeAudioForNextOpening(audio, index);

    // }
    // ///pause audio
    // if(soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id){
    //   const status = await pause(playbackObj)
    //   return updateState(this.context, 
    //     {
    //       soundObj:status,
    //       isPlaying:false
    //     })
    // } 
    // ////resume audio
    // if(soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id) {
    //     const status = await resume(playbackObj)
    //     return updateState(this.context, 
    //       {
    //         soundObj:status,
    //         isPlaying:true
    //       })  
    // }
    // ///playNext audio
    // if(soundObj.isLoaded && currentAudio.id !== audio.id){
    //    const status = await playNext(playbackObj, audio.uri);
    //    const index = audioFiles.indexOf(audio);
    //    updateState(this.context,
    //      {currentAudio:audio,
    //       playbackObj:playbackObj, 
    //       soundObj:status,
    //       isPlaying:true,
    //       currentAudioIndex:index
          
    //     })
    //     return storeAudioForNextOpening(audio, index);


    // }
      
  }
  
  layoutProvider = new LayoutProvider((i) => "audio", (type, dim) => {
    dim.width = Dimensions.get("window").width;
    dim.height = 70;
  })
  rowRenderer = (type, item, index, extendedState) => {
    // console.log(extendedState)
    return <AudioListItem 
    title={item.filename}
    activeListItem={this.context.currentAudioIndex === index}
    duration={item.duration}
    isPlaying={extendedState.isPlaying}
    onAudioPress={ () => this.handleAudioPress(item)}
    onOptionPress={() => {
    this.currentItem = item
    this.setState({...this.state, OptionModalVisible:true})
    }}/>
  }


  render() {
    return (
      <AudioContext.Consumer>
        {({dataProvider, isPlaying}) => {
          if(!dataProvider._data.length) return null;
            return (  
              <View style={{flex:1}}>
                <FocusedStatusBar backgroundColor={Theme.FONT_LIGHT}/>
                  <RecyclerListView 
                  dataProvider={dataProvider} 
                  layoutProvider={this.layoutProvider}
                  rowRenderer={this.rowRenderer}
                  extendedState={{isPlaying}}
                  />
                  <OptionModal 
                  onClose={() => this.setState({...this.state, OptionModalVisible:false})}
                  onPlayPress={() => console.log("audio playing")}
                  onPlaylistPress={() => {
                    this.context.updateState(this.context,{
                      addToPlaylist:this.currentItem,
                    });
                    this.props.navigation.navigate("PlayList")
                  }}
                  currentItem={this.currentItem}
                  visible={this.state.OptionModalVisible}
                  />
              </View>
            )
        }}
      </AudioContext.Consumer>
    )
  }
} 

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    audio:{
      padding:14,
      borderBottomColor:"blue",
      borderBottomWidth:1
    }
})
export default AudioList