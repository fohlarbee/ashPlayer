import { View, Text } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { PlayList } from '../screens/PlayList';
import { Player } from '../screens/Player';
import { AudioList } from '../screens/AudioList';
import { Ionicons as Icon } from "@expo/vector-icons";



const Tab = createBottomTabNavigator()

export default function BottomTab() {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'AudioList') {
          iconName = focused
            ? 'headset'
            : 'headset-outline';
        } else if (route.name === 'Player') {
          iconName = focused ? 'ios-musical-notes' : 'ios-musical-notes-outline';
        }else if (route.name === 'PlayList') {
          iconName = focused ? 'ios-library-sharp' : 'ios-library-outline';
        }

        // You can return any component that you like here!
        return <Icon name={iconName} size={size} color={color} />
      },
      tabBarActiveTintColor:"blue",
      tabBarInactiveTintColor:"black"
    })}
    >
        <Tab.Screen name='AudioList' component={AudioList}/>
        <Tab.Screen name='Player' component={Player}/>
        <Tab.Screen name='PlayList' component={PlayList}/>
    </Tab.Navigator>
    
  )
}