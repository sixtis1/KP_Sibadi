import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const years = [
  { label: "2023", value: "2023" },
  { label: "2022", value: "2022" },
  { label: "2021", value: "2021" },
  { label: "2020", value: "2020" },
  { label: "2019", value: "2019" },
];

const semesters = [
  { label: "Весна", value: "Весна" },
  { label: "Осень", value: "Осень" },
];

const faculties = [
  { label: "Факультет 1", value: "Факультет 1" },
  { label: "Факультет 2", value: "Факультет 2" },
  { label: "Факультет 3", value: "Факультет 3" },
];

const MainPage = () => {
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [studentId, setStudentId] = useState("");

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
          <Picker.Item label="Факультет 1" value="Факультет 1" />
          <Picker.Item label="Факультет 2" value="Факультет 2" />
          <Picker.Item label="Факультет 3" value="Факультет 3" />
        </Picker>
      </View>
      <View style={styles.pickers}>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            mode="dropdown"
            selectedValue={selectedYear}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}
          >
            {years.map((year, index) => (
              <Picker.Item key={index} label={year.label} value={year.value} />
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
              <Picker.Item
                key={index}
                label={semester.label}
                value={semester.value}
              />
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
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Показать результаты</Text>
      </TouchableOpacity>
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
