import { Alert, Text, View, StyleSheet } from 'react-native'
import React, { Component, createContext } from 'react'
import * as MediaLibrary from 'expo-media-library';
import { DataProvider } from 'recyclerlistview';
 

 export const AudioContext = createContext();

export class AppProvider extends Component {
    //   {"canAskAgain": true, "expires": "never", "granted": false, "status": "denied"}
    constructor(props
        ){
        super(props)
        this.state={
            audioFiles:[],
            permissionError:false,
            dataProvider: new DataProvider((r1, r2) => r1 !== r2)
        }
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
        this.setState({...this.state,dataProvider:dataProvider.cloneWithRows([...audioFiles, ...media.assets]), 
            audioFiles:[...audioFiles, ...media.assets]})
    }
    ///////

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
    })
    componentDidMount(){
        this.getPermission()
    }
  render() {
    const {dataProvider, audioFiles, permissionError} = this.state
    if(permissionError){
        return <View style={styles.permissionErorrHolder}>
            <Text style={styles.permissionErorrText}>seems like you haven't accepted the permission</Text>
        </View>
    }
    return (
        <AudioContext.Provider value={{audioFiles, dataProvider}}>
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