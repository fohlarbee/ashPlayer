import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import BottomTab from './infrastructure/navigation/BottomTab';
import AppProvider from './Globals/AppProvider';
import { AudioListItem } from './infrastructure/components/AudioListItem';

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
          <BottomTab/>
      </NavigationContainer>
    </AppProvider>
  
  )
}

