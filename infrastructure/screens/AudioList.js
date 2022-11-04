import { Text, View, StyleSheet, ScrollView, Dimensions } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../../Globals/AppProvider'
import {RecyclerListView, LayoutProvider} from "recyclerlistview"
import { AudioListItem } from '../components/AudioListItem'
import FocusedStatusBar from '../components/FocusedStatusBar'
import { Theme } from '../components/Theme'
import { OptionModal } from '../components/OptionModal'
import { Audio } from 'expo-av'

export class AudioList extends Component {
  static contextType = AudioContext
  constructor(props){
    super(props);
    this.state={
      OptionModalVisible: false,
      playbackObj:null,
      soundObj:null,
      currentAudio:{}
    };
    this.currentItem={

    }
  }

  handleAudioPress = async(audio) => {
    ///play audio for the first time
    if(this.state.soundObj === null){
      const playbackObj = new Audio.Sound();
      const status = await playbackObj.loadAsync({uri:audio.uri}, {shouldPlay:true});

      return this.setState({...this.state, playbackObj:playbackObj, soundObj:status, currentAudio:audio})

    }
    ///pause audio
    if(this.state.soundObj.isLoaded && this.state.soundObj.isPlaying){
      const status = await this.state.playbackObj.setStatusAsync({shouldPlay:false})
      return this.setState({...this.state, soundObj:status})
    } 
    if(this.state.soundObj.isLoaded && !this.state.soundObj.isPlaying && this.state.currentAudio.id === audio.id) {
        const status = await this.state.playbackObj.playAsync();
        
        return this.setState({...this.state, soundObj:status})
    }
      
  }
  
  layoutProvider = new LayoutProvider((i) => "audio", (type, dim) => {
    dim.width = Dimensions.get("window").width;
    dim.height = 70;
  })
  rowRenderer = (type, item) => {
    return <AudioListItem 
    title={item.filename}
    duration={item.duration}
    onAudioPress={ () => this.handleAudioPress(item)}
    onOptionPress={() => {
      this.currentItem = item
       this.setState({...this.state, OptionModalVisible:true})
    }}/>
  }


  render() {
    return (
      <AudioContext.Consumer>
        {({dataProvider}) => {
            return (  
              <View style={{flex:1}}>
                <FocusedStatusBar backgroundColor={Theme.FONT_LIGHT}/>
                  <RecyclerListView 
                  dataProvider={dataProvider} 
                  layoutProvider={this.layoutProvider}
                  rowRenderer={this.rowRenderer}
                  />
                  <OptionModal 
                  onClose={() => this.setState({...this.state, OptionModalVisible:false})}
                  onPlayPress={() => console.log("audio playing")}
                  onPlaylistPress={() => console.log("adding to playlist")}
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