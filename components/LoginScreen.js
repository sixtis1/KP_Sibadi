import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Database from "./Database.js";
import BouncyCheckbox from "react-native-bouncy-checkbox";

const db = new Database();

const LoginScreen = () => {
  useEffect(() => {
    checkLogin();
  }, []);

  const handleGoBack = () => {
    navigation.navigate("Main");
    clearInputs();
    return 1;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleGoBack);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleGoBack);
    };
  }, []);

  const checkLogin = async () => {
    const isLoggedIn = await AsyncStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      navigation.navigate("Edit");
    }
  };
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const clearInputs = () => {
    setLogin("");
    setPassword("");
    setRememberPassword(false);
    setError("");
  };

  const handleLogin = async () => {
    if (!login || !password) {
      setError("Пожалуйста введите логин и пароль.");
      return;
    }
    if (!rememberPassword) {
      db.loginFunc(login, password)
        .then(() => {
          navigation.navigate("Edit");
          clearInputs();
        })
        .catch((errorMessage) => {
          setError(errorMessage);
        });
    } else {
      db.loginFunc(login, password)
        .then(() => {
          try {
            AsyncStorage.setItem("isLoggedIn", "1");
          } catch (error) {
            console.log(error);
          }
          navigation.navigate("Edit");
          clearInputs();
        })
        .catch((errorMessage) => {
          setError(errorMessage);
        });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputView}>
        <TextInput
          value={login}
          style={styles.inputText}
          placeholder="Логин"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setLogin(text)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          value={password}
          style={styles.inputText}
          secureTextEntry={true}
          placeholder="Пароль"
          placeholderTextColor="#003f5c"
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View style={styles.rememberPasswordView}>
        <BouncyCheckbox
          size={25}
          fillColor="#2196F3"
          unfillColor="#FFFFFF"
          iconStyle={{ borderColor: "black" }}
          textStyle={{ color: "black", textDecorationLine: "none" }}
          isChecked={rememberPassword}
          disableBuiltInState
          onPress={(isChecked) => setRememberPassword(isChecked)}
          text="Запомнить пароль"
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => {
          handleLogin();
        }}
      >
        <Text style={styles.loginText}>ВОЙТИ</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#2196F3",
    marginBottom: 40,
  },
  inputView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 2.32,

    elevation: 16,
  },
  inputText: {
    height: 50,
    color: "black",
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#2196F3",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  rememberPasswordView: {
    paddingRight: 120,
  },
  errorText: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "red",
    color: "white",
    textAlign: "center",
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: "bold",
    zIndex: 10,
  },
});

export default LoginScreen;
