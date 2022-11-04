import { Dimensions, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';
import { Theme } from './Theme';

const getThumbnailText = (filename) => filename[0]

const convertTime = (minutes) => {
  if(minutes){
    const hrs = minutes/60;
    const minute = hrs.toString().split(".")[0];
    const percent = parseInt(hrs.toString().split(".")[1].slice(0,2));
    const sec = Math.ceil((60 * percent) / 100);

    if(parseInt(minute) < 10 && sec < 10){
      return `0${minute}:0${sec}`;
    }
    if(parseInt(minute) < 10){
      return `0${minute} :${sec}`;
    }
    if(sec < 10) {
      return `${minute}:0${sec}`;
    }
    return `${minute}:${sec}`;
  }
};
export const AudioListItem = ({title, duration, onOptionPress, onAudioPress}) => {
  return (
    <>
    <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onAudioPress}>
            <View style={styles.leftContainer}>
                <View style={styles.thumbnail}>
                    <Text style={styles.thumbnailText}>{getThumbnailText(title)}</Text>
                </View>
                <View style={styles.titleContainer}>
                    <Text numberOfLines={1} style={styles.titleText}>{title}</Text>
                    <Text style={styles.timeText}>{convertTime(duration)}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
        
        <View style={styles.rightContainer}>
           <Entypo 
           name="dots-three-vertical" 
           size={24} 
           onPress={onOptionPress}
           color={Theme.FONT_MEDIUM} 
           style={{padding:10}}
           
           />
        </View>
    </View>
    <View style={styles.separator}/>
    </>
  )
}

const {width} = Dimensions.get("window");

const styles = StyleSheet.create({
  container:{
    flexDirection:"row",
    alignSelf:"center",
    width:width-80,
    // backgroundColor:"blue",
    marginTop:20

  },
  leftContainer:{
    flexDirection:"row",
    alignItems:"center",
    flex:1
  },
  rightContainer:{
    flexBasis:50,
    // backgroundColor:"yellow",
    height:50,
    alignItems:"center",
    justifyContent:"center",
  },
  thumbnail:{
    height:50,
    flexBasis:50,
    backgroundColor:Theme.FONT_LIGHT,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:25
  },
  thumbnailText:{
    fontSize:22,
    fontWeight:"bold",
    color:Theme.FONT
  },
  titleContainer:{
    width:width-180,
    paddingLeft:10
  },
  titleText:{
    fontSize:16,
    color:Theme.FONT
  },
  separator:{
    width:width-80,
    backgroundColor:"#333",
    opacity:0.3,
    height:0.5,
    alignSelf:"center",
    marginTop:10 
  },
  timeText:{
    fontSize:14,
    color:Theme.FONT_LIGHT
  }

})