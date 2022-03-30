import { StatusBar } from 'expo-status-bar';
import React, { useState, useContext } from 'react';
import { initializeApp } from 'firebase/app';
import { firebase } from './firebase/firebaseClient';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TextField, Text, Button } from 'react-native-ui-lib';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import GameList from "./components/gameList"

import Signup from "./components/signup"
import Edit from "./components/editProfile"
import Login from "./components/login"
import QuizScreen from "./components/quizScreen"
import AddGames from "./components/addGames"
import AddQuestion from './components/addQuestions';
import userInfoContext from './components/userInfoContext'
import { startClock } from 'react-native-reanimated';
import QuizMenu from './components/quizMenu';

function HomeScreen({ navigation, route }) {


  const userContext = useContext(userInfoContext)
  const auth = getAuth();
  const app = firebase


  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      userContext.setUid(user.uid)
      userContext.setUser(user)
      userContext.setUserLoggedIn(true)



    } else {

    }
  });


  function logOut() {
    signOut(auth).then(() => {
      userContext.setUid(null)
      userContext.setUser(null)
      userContext.setUserLoggedIn(false)
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }





  if (userContext.user) {
    return (

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button margin-5
          white50
          label="Quiz Menu"
          onPress={() => navigation.navigate('Quiz Menu')}
        />

        <Button margin-5
          white50
          label="Edit Account"
          onPress={() => navigation.navigate('Edit')}
        />
        <Button margin-5
          white50
          label="Games List"
          onPress={() => navigation.navigate('Games List')}
        />
        <Button margin-5
          white50
          label="Add questions"
          onPress={() => navigation.navigate('Add questions')}
        />
        <Button
          margin-5
          white50
          label="logout"

          onPress={logOut}
        />



      </View>
    );


  }
  else {
    return (

      <View>
        <Button
          margin-5
          white50
          label="Login"

          onPress={() => navigation.navigate('Login')}
        />
        <Button margin-5
          white50
          label="Signup"
          onPress={() => navigation.navigate('Signup')}
        />
      </View>
    )

  }



}





const Stack = createNativeStackNavigator();

function App() {

  const [user, setUser] = useState()
  const [userUid, setUid] = useState()
  const [userLoggedIn, setUserLoggedIn] = useState(false)

  return (

    <userInfoContext.Provider value={{
      loggedIn: userLoggedIn,
      uid: userUid,
      user: user,
      isAdmin: false,
      setUser: (user) => setUser(user),
      setUid: (uid) => setUid(uid),
      setUserLoggedIn: (loggedIn) => setUserLoggedIn(loggedIn)
    }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Games List" component={GameList} />

          <Stack.Screen name="Edit" component={Edit} />
          <Stack.Screen name="Quiz Menu" component={QuizMenu} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="Add Games" component={AddGames} />
          <Stack.Screen name="Add questions" component={AddQuestion} />


        </Stack.Navigator>
      </NavigationContainer>
    </userInfoContext.Provider>
  );
}

export default App;
