import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container, Content, List, ListItem, Thumbnail, Left, Body, Right, Button } from 'native-base';
import FormButton from './FormButton';
import { AuthContext } from '../navigation/AuthProvider';

export default function Birthdays() {
  const { user, logout, addBirthday, getBirthdayList, birthdayList } = useContext(AuthContext);


  useEffect(() => {
      getBirthdayList(); //get contact from phone
}, []);

  const showNumber = (data) => {
    return data.phoneNumbers[0].number;
  }
  return (
    <View style={{}}>
      <List>
        {
          birthdayList && birthdayList.length > 0 && birthdayList.map((data, index) => (
            <ListItem thumbnail key={index}>
              <Left>
                <Thumbnail source={{ uri: 'https://www.w3schools.com/w3images/avatar2.png' }} />
              </Left>
              <Body>
                <Text>{data.name}</Text>
                <Text note numberOfLines={1}>{data.number}</Text>
              </Body>
              <Right>
                  <Text>{`${data.birthday.day}-${data.birthday.month}-${data.birthday.year}`}</Text>
              </Right>
            </ListItem>
          ))
        }
      </List>
    </View>
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