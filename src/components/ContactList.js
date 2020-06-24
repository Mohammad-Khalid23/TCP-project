import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, FlatList, Platform, Dimensions } from 'react-native';
import { Container, Content, List, ListItem, Thumbnail, Left, Body, Right, Button, Toast } from 'native-base';
import { AuthContext } from '../navigation/AuthProvider';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Contacts from "react-native-contacts";
import firestore from '@react-native-firebase/firestore';

export default function ContactList(props) {
    const [state, setState] = useState({
        contacts: [],
        birthdays: [],
        loading: false
    });

    const { user, logout, addBirthday, birthdayList, setBirthdays } = useContext(AuthContext);

    const PERMISSION_KEY = Platform.os === 'ios' ? PERMISSIONS.IOS.CONTACTS : PERMISSIONS.ANDROID.READ_CONTACTS;

    const { width, height } = Dimensions.get('screen');

    useEffect(() => {
        if (state.contacts.length === 0) {
            getContacts(); //get contact from phone
        }
    }, []);

    const getBirthdayList = async (contactList) => {
        try {
            await firestore().collection("users").doc(user.uid)
                .onSnapshot((snapshot) => {

                    let birthdayList = [];

                    snapshot.data().birthdays && snapshot.data().birthdays.forEach(doc => {
                        birthdayList.push(doc);
                    });
                    setBirthdays(birthdayList); //save in context state
                    filterContact(contactList, birthdayList)
                    return birthdayList;
                });
        } catch (e) {
            console.error(e);
        }
    }

    const getContacts = async () => {
        try {
            const result = await check(PERMISSION_KEY);
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    Alert.alert(
                        'This feature is not available (on this device / in this context)',
                    );
                    break;
                case RESULTS.DENIED:
                    await request(PERMISSION_KEY)
                    getContacts();
                    break;
                case RESULTS.GRANTED:
                    setAllContact();
                    break;
                case RESULTS.BLOCKED:
                    Alert.alert('The permission is denied and not requestable anymore');
                    break;
            }

        } catch (error) {
            alert(error);

        }

    }

    const setAllContact = () => {
        try {
            setState({ ...state, loading: true })
            Contacts.getAll(async (err, contacts) => {
                const contactList = contacts.slice(0, 20);
                await getBirthdayList(contactList);
                if (err) {
                    setState({
                        ...state,
                        loading: false,
                        contacts: []
                    })
                }
            });

        } catch (error) {
            console.log("=======ERoor dead", error);
        }
    }

    const filterContact = (contacts, birthdays) => {
        const filteredList = [];
        contacts.map(function (e) {
            var f = birthdays.find(a => showNumber(e) === a.number);
            if (f === undefined) filteredList.push(e);
        });

        setState({
            ...state,
            loading: false,
            contacts: filteredList
        })
    }

    const showNumber = (data) => {
        // console.log('=============SHOW NUMBER FUNCTION=============',data);
        let number = '';
        if (data.phoneNumbers && data.phoneNumbers.length > 0) {
            number = data.phoneNumbers[0].number;
        } else {
            console.log('========Datad esle', data);
        }
        return number;
    }

    const _addBirthday = async (data, index) => {
        try {
            const listToFilter = state.contacts;
            const birthdayData = {
                name: data.displayName,
                birthday: data.birthday,
                number: showNumber(data)
            };
            await addBirthday(birthdayData);
            listToFilter.splice(index, 1);
            setState({
                ...state,
                loading: false,
                contacts: listToFilter
            })
            Toast.show({
                text: "Birthday Added",
                type: "success",
                duration: 1000
            });
        } catch (error) {
            console.log('===Error', error);
        }
    }

    const Item = ({ data, index }) => {
        return (
            <ListItem thumbnail >
                <Left>
                    <Thumbnail source={{ uri: 'https://www.w3schools.com/w3images/avatar2.png' }} />
                </Left>
                <Body>
                    <Text>{data.displayName}</Text>
                    <Text note numberOfLines={1}>{showNumber(data)}</Text>
                </Body>
                <Right>
                    {
                        data.birthday ?
                            <Button style={{ width: 70, justifyContent: 'center', borderColor: 'black' }} bordered onPress={() => _addBirthday(data)}>
                                <Text>Add</Text>
                            </Button>
                            :
                            <Button style={{ width: 70, justifyContent: 'center', borderColor: 'black' }} bordered>
                                <Text style={{}} >Invite</Text>
                            </Button>
                    }
                </Right>
            </ListItem>
        );
    }

    return (
        <Container>
            {
                state.loading === true ?
                    <ActivityIndicator size='large' />
                    :
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 0.93 }}>
                            <FlatList
                                data={state.contacts}
                                renderItem={({ item, index }) => <Item data={item} index={index} />}
                                keyExtractor={item => item.id}
                            />
                        </View>
                        <View style={{ flex: 0.07, justifyContent: 'center' }}>
                            <Button style={{ justifyContent: 'center' }} onPress={()=>props.navigation.replace('Birthdays')}><Text style={{ color: 'white', fontSize: 18 }}>Done</Text></Button>
                        </View>
                    </View>
            }
        </Container>
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