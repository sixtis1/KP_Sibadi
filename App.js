import React, { useEffect } from "react";
import Database from "./components/Database";
import MainPage from "./components/MainPage";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import ResultsScreen from "./components/ResultsScreen";
import EditScreen from "./components/EditScreen";
import LoginScreen from "./components/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

const db = new Database();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(null);

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const checkIfLoggedIn = async () => {
    const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
    setIsLoggedIn(isLoggedIn);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Main"
          component={MainPage}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Results"
          component={ResultsScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Edit"
          component={EditScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function testDatabase() {
  const db = new Database();
  db.getSemestersForSubject("Математика")
    .then((semesters) => {
      console.log(semesters);
    })
    .catch((error) => {
      console.log(error);
    });
}
testDatabase();
