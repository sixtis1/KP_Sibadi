import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import Database from "./Database.js";
import ResultsScreen from "./ResultsScreen";

const faculties = [
  { label: "Факультет 1", value: "Факультет 1" },
  { label: "Факультет 2", value: "Факультет 2" },
  { label: "Факультет 3", value: "Факультет 3" },
];

const db = new Database();

const MainPage = ({ navigation }) => {
  const [selectedFaculty, setSelectedFaculty] = useState("Факультет 1");
  const [selectedYear, setSelectedYear] = useState(2022);
  const [selectedSemester, setSelectedSemester] = useState("Весна");
  const [studentId, setStudentId] = useState(1);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [years, setYears] = useState([]);
  const [semesters, setSemesters] = useState([]);

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
      .catch((error) => {
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
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={require("./assets/logo.png")} />
      </View>
      <View style={styles.facultyPicker}>
        <Picker
          style={styles.facultyPicker}
          mode="dropdown"
          selectedValue={selectedFaculty}
          onValueChange={(itemValue) => setSelectedFaculty(itemValue)}
        >
          {faculties.map((faculty, index) => (
            <Picker.Item
              key={index}
              label={faculty.label}
              value={faculty.value}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.pickers}>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={selectedYear}
            onValueChange={(value) => setSelectedYear(value)}
          >
            {years.map((year) => (
              <Picker.Item key={year} label={year.toString()} value={year} />
            ))}
          </Picker>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            mode="dropdown"
            selectedValue={selectedSemester}
            onValueChange={(itemValue) => setSelectedSemester(itemValue)}
          >
            {semesters.map((semester, index) => (
              <Picker.Item label={semester} value={semester} key={index} />
            ))}
          </Picker>
        </View>
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
      {results.length > 0 && <ResultsScreen results={results} />}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  facultyPicker: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    width: 272,
    height: 50,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  pickers: {
    flexDirection: "row",
    paddingLeft: 15,
  },

  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  picker: {
    width: 126,
    height: 50,
  },

  inputContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  input: {
    width: 250,
    height: 50,
    fontSize: 16,
  },

  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#4287f5",
    borderRadius: 5,
    marginTop: 20,
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
