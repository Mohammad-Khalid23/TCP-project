import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container, Header, Content, Tab, Tabs } from 'native-base';
import FormButton from '../components/FormButton';
import ContactList from '../components/ContactList';
import BirthdayList from '../components/Birthdays';
import { AuthContext } from '../navigation/AuthProvider';

export default function HomeScreen() {
  const { user, logout } = useContext(AuthContext);
  // console.log('=========>',user);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome user {user.uid}</Text>
      <FormButton buttonTitle='Logout' onPress={() => logout()} />
    </View>
    // <Container>
    //   <Tabs
    //   tabBarPosition='bottom'
    //   >
    //     <Tab heading="Contacts">
    //       <ContactList />
    //     </Tab>
    //     <Tab heading="Birthdays">
    //       <BirthdayList/>
    //     </Tab>
    //   </Tabs>
    // </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f1'
  },
  text: {
    fontSize: 20,
    color: '#333333'
  }
});