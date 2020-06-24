import React, { useContext } from 'react';
import { View, Text,TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ContactScreen from '../components/ContactList';
import BirthdayScreen from '../components/Birthdays';
import { AuthContext } from '../navigation/AuthProvider';

const Stack = createStackNavigator();
export default function HomeStack({navigation}) {
  const { logout } = useContext(AuthContext);
  return (
    <Stack.Navigator initialRouteName='Birthdays'>
      <Stack.Screen name='Contacts' component={ContactScreen}
        options={{
          title: 'Contacts',
          headerRight: (props) => (<TouchableOpacity onPress={() =>{ logout(); navigation.replace('Auth')}} style={{ marginRight: 10 }}><Text>Logout</Text></TouchableOpacity>)
        }}
      />
      <Stack.Screen name='Birthdays' component={BirthdayScreen}
        options={{
          title: 'Birthdays',
          headerRight: (props) => (<TouchableOpacity onPress={() =>{ logout(); navigation.replace('Auth')}} style={{ marginRight: 10 }}><Text>Logout</Text></TouchableOpacity>)
        }}
      />
    </Stack.Navigator>
  );
}