import { Alert } from "react-native";
import { storeAudioForNextOpening } from "./Helper,";

// play audio
export const play = async(playbackObj, uri) =>{
    try {
        return await playbackObj.loadAsync(
            {uri},
            {shouldPlay:true, progressUpdateIntervalMillis: 100}
        )
    } catch (error) {
        console.log("error inside play method", error.message)
    }
}
export const pause = async(playbackObj) => {
    try{
        return await playbackObj.setStatusAsync({shouldPlay:false})

    }catch (error) {
        console.log("error inside pause method", error.message)

    }
}
export const resume = async(playbackObj) => {
    try{
        return playbackObj.playAsync();


    }catch (error) {
        console.log("error inside resume method", error.message)

    }
    
}
export const playNext = async(playbackObj, uri) => {
    try {
        await playbackObj.stopAsync();
        await playbackObj.unloadAsync();
       return await play(playbackObj, uri)
    } catch (error) {
        console.log("error inside PlayNext method", error.message)

    }
   
}
export const selectAudio = async (audio, context) => {
    const {playbackObj, soundObj, currentAudio, updateState, audioFiles, onPlaybackStatusUpdate} = context
    try {
         ///play audio for the first time
        if(soundObj === null){
            const status = await play(playbackObj, audio.uri);
            const index = audioFiles.indexOf(audio)
            // console.log("here",index)
            updateState(context,
            {
                playbackObj:playbackObj,
                currentAudio:audio,
                soundObj:status,
                isPlaying:true,
                currentAudioIndex: index
    
            })
            playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
            return storeAudioForNextOpening(audio, index);
    
        }
        ///pause audio
        if(soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id){
            const status = await pause(playbackObj)
            return updateState(context, 
            {
                soundObj:status,
                isPlaying:false
            })
        } 
        ////resume audio
        if(soundObj.isLoaded && !soundObj.isPlaying && currentAudio.id === audio.id) {
            const status = await resume(playbackObj)
            return updateState(context, 
                {
                soundObj:status,
                isPlaying:true
                })  
        }
        ///playNext audio
        if(soundObj.isLoaded && currentAudio.id !== audio.id){
            const status = await playNext(playbackObj, audio.uri);
            const index = audioFiles.indexOf(audio);
            updateState(context,
            {currentAudio:audio,
                playbackObj:playbackObj, 
                soundObj:status,
                isPlaying:true,
                currentAudioIndex:index
                
            })
            return storeAudioForNextOpening(audio, index);
    
    
        }
    } catch (error) {
        Alert.alert("Error", "Error from select audio function", error.message)
    }
   
}

export const changeAudio = async(context, select) => {
    const {playbackObj, currentAudioIndex, totalAudioCount, audioFiles, updateState} = context;
    try {
        const {isLoaded} = await playbackObj.getStatusAsync();
        const isLastAudio = currentAudioIndex + 1 === totalAudioCount;
        const isFirstAudio = currentAudioIndex <= 0;
        let audio;
        let index;
        let status;

        // for next
        if(select === "next"){
            audio = audioFiles[currentAudioIndex + 1];
            if(!isLoaded && !isLastAudio){
                index = currentAudioIndex + 1;
                status = await play(playbackObj, audio.uri);
                }
                if(isLoaded && !isLastAudio){
                index = currentAudioIndex + 1;
                status = await playNext(playbackObj, audio.uri);
                }
                if(isLastAudio){
                index = 0;
                audio = audioFiles[index];
                if(isLoaded){
                status = await playNext(playbackObj, audio.uri);
                }else{
                    status = await play(playbackObj, audio.uri);
            
                }
                }
        }
        
            // for previous
        if(select === "previous"){
            audio = audioFiles[currentAudioIndex - 1];
            if(!isLoaded && !isFirstAudio){
                index = currentAudioIndex - 1;
                status = await play(playbackObj, audio.uri);
              }
            if(isLoaded && !isFirstAudio){
            index = currentAudioIndex - 1;
            status = await playNext(playbackObj, audio.uri);
            }
            if(isFirstAudio){
            index = totalAudioCount - 1;
            audio = audioFiles[index];
                if(isLoaded){
                status = await playNext(playbackObj, audio.uri);
                }else{
                    status = await play(playbackObj, audio.uri);
            
                }
            }
        }
       

        updateState(context,
          {
           currentAudio:audio,
           soundObj:status,
           isPlaying:true,
           currentAudioIndex:   index,
           playbackDuration:null,
           playbackPosition:null,
    
         });
         storeAudioForNextOpening(audio, index);
    } catch (error) {
        Alert.alert("Error", "Error from change audio", error.message)
    }
    
};
    
