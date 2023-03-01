import React from "react";
import Database from "./components/Database";
import MainPage from "./components/MainPage";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import ResultsScreen from "./components/ResultsScreen";

const Stack = createStackNavigator();

const db = new Database();

export default function App() {
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
  const db = new Database();
  db.getGrades(1, 2022, "Весна")
    .then((grades) => console.log("Grades:", grades))
    .catch((error) => console.error("Error:", error));
}
