import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Database from "./Database.js";
import DropDownPicker from "react-native-dropdown-picker";
import Dictionary from "../assets/dictionaryLang";

const db = new Database();
db.showDB();
const MainPage = ({ navigation }) => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [studentId, setStudentId] = useState(1);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [openYear, setOpenYear] = useState(false);
  const [openSemester, setOpenSemester] = useState(false);

  useEffect(() => {
    db.getYears()
      .then((json) => {
        console.log(json);
        const years = json.map((item) => item.year);
        setYears(years);
      })
      .catch((error) => {
        setError("Ошибка: " + error);
      });
  }, []);

  useEffect(() => {
    db.getSemesters()
      .then((result) => {
        const semesterValues = result.map((item) => item.semester);
        setSemesters(semesterValues);
      })
      .catch((error) => {
        console.error("Failed to fetch semesters from DB", error);
        setError("Failed to fetch semesters from DB");
      });
  }, []);

  const saveData = async (
    results,
    studentId,
    selectedYear,
    selectedSemester
  ) => {
    try {
      await AsyncStorage.setItem("results", JSON.stringify(results));
      await AsyncStorage.setItem("studentId", studentId.toString());
      await AsyncStorage.setItem("selectedYear", selectedYear.toString());
      await AsyncStorage.setItem("selectedSemester", selectedSemester);
    } catch (error) {
      console.log(error);
    }
  };

  const clearAllData = async () => {
    try {
      await AsyncStorage.removeItem("results");
      await AsyncStorage.removeItem("studentId");
      await AsyncStorage.removeItem("selectedYear");
      await AsyncStorage.removeItem("selectedSemester");
      console.log("AsyncStorage successfully cleared!");
    } catch (e) {
      console.log("Failed to clear AsyncStorage");
    }
  };

  const closeDropDown = () => {
    function controller(dropdownIndex) {
      switch (dropdownIndex) {
        case 1:
          if (openSemester) {
            setOpenSemester(false);
          }
        case 2:
          if (openYear) {
            setOpenYear(false);
          }
      }
    }

    const indexes = {
      indexSemester: 2,
      indexYear: 1,
    };

    const controllers = {
      controllerSemester: function () {
        controller(indexes.indexSemester);
      },
      controllerYear: function () {
        controller(indexes.indexYear);
      },
    };
    return controllers;
  };

  const handleShowResults = () => {
    setError(null);
    clearAllData();
    console.log(studentId, selectedYear, selectedSemester);
    db.getGrades(studentId, selectedYear, selectedSemester)
      .then((results) => {
        if (results.length === 0) {
          throw new Error(
            "Ошибка в введенных данных. Проверьте данные и повторите попытку."
          );
        } else {
          setResults(results);
          saveData(results, studentId, selectedYear, selectedSemester);
          showResults();
        }
      })
      .catch(() => {
        setError(
          "Ошибка в введенных данных. Проверьте данные и повторите попытку."
        );
        setResults([]);
        clearAllData();
      });
  };

  async function getLoggined() {
    try {
      const loggined = await AsyncStorage.getItem("isLoggedIn");
      if (loggined == null) {
        console.log(loggined + "2");
        navigation.navigate("Login");
      } else {
        console.log(loggined + "1");
        navigation.navigate("Edit");
      }
    } catch (e) {
      console.log(e);
    }
  }

  const showResults = () => {
    navigation.navigate("Results");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
      </View>
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={openYear}
          value={selectedYear}
          placeholder={Dictionary.selectYearLable.ru}
          items={years.map((year) => ({
            label: year.toString(),
            value: year,
          }))}
          setOpen={(isOpen) => {
            setOpenYear(isOpen);
            closeDropDown().controllerYear();
          }}
          setValue={setSelectedYear}
          setItems={() => {}}
          containerStyle={[styles.dropdownContainer, { zIndex: 5 }]}
          style={[styles.dropdown]}
          dropDownContainerStyle={[{ width: "77%" }]}
        />
      </View>
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={openSemester}
          value={selectedSemester}
          placeholder="Выберите семестр"
          items={semesters.map((semester) => ({
            label: semester,
            value: semester,
          }))}
          setOpen={(isOpen) => {
            setOpenSemester(isOpen);
            closeDropDown().controllerSemester();
          }}
          setValue={setSelectedSemester}
          setItems={() => {}}
          containerStyle={[styles.dropdownContainer, { zIndex: 4 }]}
          style={[styles.dropdown]}
          dropDownContainerStyle={[{ width: "77%" }]}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Введите номер зачетки"
          style={styles.input}
          value={studentId}
          onChangeText={(text) => setStudentId(text)}
          keyboardType="numeric"
          onSubmitEditing={handleShowResults}
          maxLength={8}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handleShowResults();
        }}
      >
        <Text style={styles.buttonText}>Показать результаты</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => {
          getLoggined();
        }}
      >
        <Text style={styles.loginButtonText}>Войти</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    position: "relative",
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  dropdownContainer: {
    flexdirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 5,
    paddingHorizontal: 20,
    minWidth: "58%",
  },
  dropdown: {
    width: "77%",
  },
  inputContainer: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "white",
    zIndex: 3,
  },
  input: {
    minWidth: "58%",
    height: 50,
    fontSize: 16,
    backgroundColor: "white",
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#2196F3",
    borderRadius: 50,
    marginTop: 20,
    color: "white",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  logoContainer: {
    marginBottom: 35,
    alignSelf: "center",
  },
  logo: {
    width: 170,
    height: 170,
    resizeMode: "contain",
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
  loginButton: {
    width: 70,
    height: 40,
    backgroundColor: "#2196F3",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 45,
    right: 15,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MainPage;
