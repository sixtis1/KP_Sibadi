import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const years = [
  { label: "2027", value: "2027" },
  { label: "2026", value: "2026" },
  { label: "2025", value: "2025" },
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
];

const semesters = [
  { label: "Весна", value: "Весна" },
  { label: "Осень", value: "Осень" },
];

const App = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [studentId, setStudentId] = useState("");

  return (
    <View style={styles.container}>
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
  pickerContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    width: 125,
    height: 50,
    marginRight: 10,
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
  resultContainer: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default App;
