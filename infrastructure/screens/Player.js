import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import FocusedStatusBar from '../components/FocusedStatusBar';
import { StatusBar } from 'expo-status-bar';
import { Theme } from '../components/Theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { PlayerButton } from '../components/PlayerButton';
import { AudioContext } from '../../Globals/AppProvider';
import { changeAudio, pause, play, playNext, resume, selectAudio } from '../components/AudioContoller';
import { convertTime, storeAudioForNextOpening } from '../components/Helper,';

export const Player = () => {

  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration} = context;
  const [currentPosition, setCurrentPosition] = useState(0);

  const calculateSlekBar = () => {
    if(playbackPosition !== null && playbackDuration !== null){
      return playbackPosition / playbackDuration
    }
    else {
      return 0
    }
  }

  useEffect(() => {
    context.loadPreviousAudio();
  },[]);

  const handlePlayPause = async () => {
    await selectAudio(context.currentAudio, context)
    // // play
    // if(context.soundObj === null){
    //   const audio = context.currentAudio;
    //   const status = await play(context.playbackObj, audio.uri)
    //   context.playbackObj.setOnPlaybackStatusUpdate(
    //     context.onPlaybackStatusUpdate
    //   );
    //   return context.updateState(context, {
    //     soundObj:status,
    //     currentAudio:audio,
    //     isPlaying:true,
    //     currentAudioIndex:context.currentAudioIndex
    //   })
    // }
    // //pause
    // if(context.soundObj && context.soundObj.isPlaying){
    //   const status = await pause(context.playbackObj);
    //   return context.updateState(context, {
    //     soundObj: status,
    //     isPlaying:false
    //   })
    // }
    // //resume
    // if(context.soundObj && !context.soundObj.isPlaying){
    //   const status = await resume(context.playbackObj);
    //   return context.updateState(context, {
    //     soundObj: status,
    //     isPlaying:true,
    //   })
    // }

  };
  const handleNext = async () => {
    await changeAudio(context, "next");
    // const {isLoaded} = await context.playbackObj.getStatusAsync();
    // const isLastAudio = context.currentAudioIndex + 1 === context.totalAudioCount;
    // const audio = context.audioFiles[context.currentAudioIndex + 1];
    // let index;
    // let status;

    // if(!isLoaded && !isLastAudio){
    //   index = context.currentAudioIndex + 1;
    //   status = await play(context.playbackObj, audio.uri);
    // }
    // if(isLoaded && !isLastAudio){
    //   index = context.currentAudioIndex + 1;
    //   status = await playNext(context.playbackObj, audio.uri);
    // }
    // if(isLastAudio){
    //   index = 0;
    //   audio = context.audioFiles[index];
    //   if(isLoaded){
    //   status = await playNext(context.playbackObj, audio.uri);
    //   }else{
    //     status = await play(context.playbackObj, audio.uri);

    //   }
    // }
    // context.updateState(context,
    //   {
    //    playbackObj:context.playbackObj,
    //    currentAudio:audio,
    //    soundObj:status,
    //    isPlaying:true,
    //    currentAudioIndex: index,
    //    playbackDuration:null,
    //    playbackPosition:null,

    //  });
    //  storeAudioForNextOpening(audio, index);
  }


  const handlePrevious = async () => {
    await changeAudio(context, "previous");
    // const {isLoaded} = await context.playbackObj.getStatusAsync();
    // const isFirstAudio = context.currentAudioIndex <= 0;
    // const audio = context.audioFiles[context.currentAudioIndex - 1];
    // let index;
    // let status;

    // if(!isLoaded && !isFirstAudio){ 
    //   index = context.currentAudioIndex - 1;
    //   status = await play(context.playbackObj, audio.uri);
    // }
    // if(isLoaded && !isFirstAudio){
    //   index = context.currentAudioIndex - 1;
    //   status = await playNext(context.playbackObj, audio.uri);
    // }
    // if(isFirstAudio){
    //   index = context.totalAudioCount - 1;
    //   audio = context.audioFiles[index];
    //   if(isLoaded){
    //   status = await playNext(context.playbackObj, audio.uri);
    //   }else{
    //     status = await play(context.playbackObj, audio.uri);

    //   }
    // }
    // context.updateState(context,
    //   {
    //    playbackObj:context.playbackObj,
    //    currentAudio:audio,
    //    soundObj:status,
    //    isPlaying:true,
    //    currentAudioIndex: index,
    //    playbackDuration:null,
    //    playbackPosition:null,

    //  });
    //  storeAudioForNextOpening(audio, index);
  }

  const renderCurrentTime = () => {
    return convertTime(context.playbackPosition / 1000);
  }


  if(!context.currentAudio) return null;
  return (
    <>
    <FocusedStatusBar/>
    <View style={styles.container}>
      <Text style={styles.audioCount}>{`${context.currentAudioIndex + 1} / ${context.totalAudioCount}`}</Text>
      <View style={styles.midBannerContainer}>
          <MaterialCommunityIcons name="music-circle" size={300} color={ context.isPlaying ? Theme.ACTIVE_BG : Theme.FONT_MEDIUM }/>
      </View>
      <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle}>{context.currentAudio.filename}</Text>
          <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:10}}>
            <Text>{convertTime(context.currentAudio.duration)}</Text>
            <Text>{currentPosition ? currentPosition : renderCurrentTime()}</Text>
          </View>
          <Slider
            style={{width: width, height: 40}} 
            minimumValue={0}
            maximumValue={1}
            value={calculateSlekBar()}
            minimumTrackTintColor={Theme.FONT_MEDIUM} 
            maximumTrackTintColor={Theme.ACTIVE_BG}
            onValueChange={(value) => {  
              setCurrentPosition(convertTime(value * context.currentAudio.duration))
             }}
             onSlidingStart={async() => {
                if(!context.isPlaying) return;
                try {
                  await pause(context.playbackObj);
                } catch (error) {
                  console.log("error inside onsliding start function", error)
                  
                }
             }}
             onSlidingComplete={async(value) => {
              if(context.soundObj === null) return;

              try {
                const status = await context.playbackObj.setPositionAsync(Math.floor(context.soundObj.durationMillis * value))
              } catch (error) {
                console.log("error inside onsliding complete function", error)

              }
             }}
          />
          <View style={styles.audioControllers}>
            <PlayerButton iconType="PREV" onPress={handlePrevious}/>
            <PlayerButton onPress={handlePlayPause} style={{marginHorizontal:25}} iconType={context.isPlaying ? "PLAY" : "PAUSE"}/>
            <PlayerButton iconType="NEXT" onPress={handleNext}/>
          </View>
      </View>
    </View>
    </>
  )
}
const {width} = Dimensions.get("window")
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    audioCount:{
      padding:15,
      textAlign:"right",
      color:Theme.FONT_LIGHT,
      fontSize:16
    },
    midBannerContainer:{
      flex:1,
      justifyContent:"center",
      alignItems:"center"
    },
    audioTitle:{
      fontSize:16,
      color:"#6C4AB6",
      padding:15
    },
    audioControllers:{
      flexDirection:"row",
      width:width,
      justifyContent:"center",
      alignItems:"center",
      paddingBottom:15
    }
})
