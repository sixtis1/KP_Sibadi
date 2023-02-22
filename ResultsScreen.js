import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Table, Row } from "react-native-table-component";

export default function ResultsScreen() {
  const [results, setResults] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const navigation = useNavigation();

  const handleGoBack = () => {
    setResults([]);
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
    return true;
  };

  async function getResults() {
    try {
      const storedResults = await AsyncStorage.getItem("results");
      const storedStudentId = await AsyncStorage.getItem("studentId");
      const storedSelectedYear = await AsyncStorage.getItem("selectedYear");
      const storedSelectedSemester = await AsyncStorage.getItem(
        "selectedSemester"
      );

      if (
        storedResults !== null &&
        storedStudentId !== null &&
        storedSelectedYear !== null &&
        storedSelectedSemester !== null
      ) {
        setResults(JSON.parse(storedResults));
        setStudentId(storedStudentId);
        setSelectedYear(storedSelectedYear);
        setSelectedSemester(storedSelectedSemester);
      }
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    getResults();
    BackHandler.addEventListener("hardwareBackPress", handleGoBack);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleGoBack);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Результаты экзаменов</Text>
        <Text style={styles.subtitle}>Студент: {studentId}</Text>
        <Text style={styles.subtitle}>Год: {selectedYear}</Text>
        <Text style={styles.subtitle}>Семестр: {selectedSemester}</Text>
      </View>
      <View style={styles.tableContainer}>
        <Table style={styles.table}>
          <Row
            data={["Предмет", "Балл 1", "Балл 2", "Оценка"]}
            style={styles.head}
            textStyle={styles.textHead}
          />
          {results.map((result) => (
            <Row
              key={result.subject_name}
              data={[
                result.subject_name,
                result.score_1k.toString(),
                result.score_2k.toString(),
                result.grade.toString(),
              ]}
              style={styles.row}
              textStyle={styles.text}
            />
          ))}
        </Table>
      </View>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} title="Назад" onPress={handleGoBack} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5fcff",
    paddingTop: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 5,
  },
  tableContainer: {
    flex: 1,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  table: {
    flex: 1,
  },
  head: {
    height: 40,
    backgroundColor: "#f1f8ff",
  },
  textHead: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
  header: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
    width: 150,
  },
});
