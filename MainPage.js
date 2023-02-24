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

const db = new Database();

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
      await AsyncStorage.clear();
      console.log("AsyncStorage successfully cleared!");
    } catch (e) {
      console.log("Failed to clear AsyncStorage");
    }
  };

  const handleShowResults = () => {
    setError(null);
    clearAllData();
    console.log(studentId, selectedYear, selectedSemester);
    db.getGrades(studentId, selectedYear, selectedSemester)
      .then((results) => {
        if (results.length === 0) {
          throw new Error(
            "Ошибка в введенных данных. Проверьте данные и повторите попытку"
          );
        } else {
          setResults(results);
          saveData(results, studentId, selectedYear, selectedSemester);
          showResults();
        }
      })
      .catch(() => {
        setError(
          "Ошибка в введенных данных. Проверьте данные и повторите попытку"
        );
        setResults([]);
        clearAllData();
      });
  };

  const showResults = () => {
    navigation.navigate("Results");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("./assets/logo.png")} />
      </View>
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={openYear}
          value={selectedYear}
          placeholder="Выберите год обучения"
          items={years.map((year) => ({
            label: year.toString(),
            value: year,
          }))}
          setOpen={(isOpen) => {
            setOpenYear(isOpen);
            setOpenSemester(false);
          }}
          setValue={setSelectedYear}
          setItems={() => {}}
          containerStyle={[styles.dropdownContainer, { zIndex: 3 }]}
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
            setOpenYear(false);
          }}
          setValue={setSelectedSemester}
          setItems={() => {}}
          containerStyle={[styles.dropdownContainer, { zIndex: 1 }]}
          style={[styles.dropdown]}
          dropDownContainerStyle={[{ width: "77%" }]}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Номер зачетки:</Text>
        <TextInput
          style={styles.input}
          value={studentId}
          onChangeText={(text) => setStudentId(text)}
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleShowResults}>
        <Text style={styles.buttonText}>Показать результаты</Text>
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
  },

  input: {
    width: 220,
    height: 45,
    fontSize: 16,
    backgroundColor: "white",
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#5188E3",
    borderRadius: 50,
    marginTop: 20,
    color: "white",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  logoContainer: {
    marginBottom: 80,
    alignSelf: "center",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
});

export default MainPage;
