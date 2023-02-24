import React from "react";
import { StyleSheet, View } from "react-native";
import Database from "./Database";
import MainPage from "./MainPage";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import ResultsScreen from "./ResultsScreen";

const Stack = createStackNavigator();

export default function App() {
  const db = new Database();

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function testDatabase() {
  const database = new Database();
  database
    .getGrades(1, 2022, "Весна")
    .then((grades) => console.log("Grades:", grades))
    .catch((error) => console.error("Error:", error));
}

testDatabase();
