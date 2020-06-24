import React, { createContext, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [birthdayList, setBirthdays] = useState(null);
    return (
      <AuthContext.Provider
        value={{
          user,
          setUser,
          birthdayList,
          setBirthdays,
          login: async (email, password,navigation) => {
            try {
              await auth().signInWithEmailAndPassword(email, password);
              navigation.replace('Home',{ screen: 'Birthdays' })
            } catch (e) {
              console.log(e);
            }
          },
          register: async (email, password,navigation) => {
            try {
              const response = await auth().createUserWithEmailAndPassword(email, password);
              console.log('-------resgitered user', response.user);
              await firestore().collection(`users`).doc(response.user.uid).set({ email });
              navigation.replace('Home',{ screen: 'Contacts' })
            } catch (e) {
              console.log(e);
            }
          },
          logout: async () => {
            try {
              await auth().signOut();
            } catch (e) {
              console.error(e);
            }
          },
          addBirthday: async (data) => {
            try {
              firestore()
              .collection(`users`)
              .doc(user.uid).update(({ birthdays: firestore.FieldValue.arrayUnion(data) }))
              .then(() => {
                console.log('Birthday added!');
              });
            } catch (e) {
              console.error(e);
            }
          },
          getBirthdayList: async () => {
            try {
              await firestore().collection("users").doc(user.uid)
                .onSnapshot((snapshot) => {
                  let birthdayList = [];
                  snapshot.data().birthdays && snapshot.data().birthdays.forEach(doc => {
                    birthdayList.push(doc);
                  });
                  setBirthdays(birthdayList)
                });
            } catch (e) {
              console.error(e);
            }
          }
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };