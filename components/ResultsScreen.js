import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Table, Row } from "react-native-table-component";
import Dictionary from "../assets/dictionaryLang";

export default function ResultsScreen() {
  const [results, setResults] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const navigation = useNavigation();
  const [language, setLanguage] = useState();

  const handleGoBack = () => {
    setResults([]);
    navigation.navigate("Main");
    return 1;
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

  function translateSubject(subjectKey) {
    const translatedSubject = Dictionary.subjects[subjectKey]?.[language];
    if (translatedSubject) {
      return translatedSubject;
    } else {
      return subjectKey;
    }
  }

  function translateSemester(semesterKey) {
    const translatedSemester = Dictionary.semesters[semesterKey]?.[language];
    if (translatedSemester) {
      return translatedSemester;
    } else {
      return semesterKey;
    }
  }

  async function getLang() {
    try {
      const storedLang = await AsyncStorage.getItem("language");
      if (storedLang !== null || storedLang !== undefined) {
        setLanguage(storedLang);
      } else setLanguage("ru");
    } catch (e) {
      setLanguage("ru");
      console.log(e);
    }
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleGoBack);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleGoBack);
    };
  }, []);

  useEffect(() => {
    getResults();
  }, []);

  getLang();
  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.header}>
        <Text style={styles.title}>
          {Dictionary.resultsScreen.title[language]}
        </Text>
        <Text style={styles.subtitle}>
          {Dictionary.resultsScreen.subtitleStudent[language]} {studentId}
        </Text>
        <Text style={styles.subtitle}>
          {Dictionary.resultsScreen.subtitleYear[language]} {selectedYear}
        </Text>
        <Text style={styles.subtitle}>
          {Dictionary.resultsScreen.subtitleSemester[language]}{" "}
          {translateSemester(selectedSemester)}
        </Text>
      </SafeAreaView>
      <SafeAreaView style={styles.tableContainer}>
        <Table style={styles.table}>
          <Row
            data={[
              Dictionary.resultsScreen.tableHead.subject[language],
              Dictionary.resultsScreen.tableHead.score1[language],
              Dictionary.resultsScreen.tableHead.score2[language],
              Dictionary.resultsScreen.tableHead.grade[language],
            ]}
            style={[styles.head, styles.borderStyle]}
            textStyle={[styles.textHead]}
            flexArr={[2, 0.9, 0.9, 0.8]}
          />
          {results.map((result) => (
            <Row
              key={result.subject_name}
              data={[
                translateSubject(result.subject_name),
                result.score_1k.toString(),
                result.score_2k.toString(),
                result.grade.toString(),
              ]}
              style={[styles.row, styles.borderStyle]}
              textStyle={[styles.text]}
              flexArr={[2, 0.9, 0.9, 0.8]}
            />
          ))}
        </Table>
      </SafeAreaView>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          handleGoBack();
        }}
      >
        <SafeAreaView style={styles.button}>
          <Text style={styles.buttonText}>
            {Dictionary.backButton[language]}
          </Text>
        </SafeAreaView>
      </TouchableOpacity>
    </SafeAreaView>
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
  borderStyle: {
    borderWidth: 1,
    borderColor: "gray",
  },
  head: {
    height: 40,
    backgroundColor: "#c5d8f7",
  },
  textHead: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    borderRightWidth: 1,
    borderColor: "gray",
    padding: 10,
  },
  row: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  text: {
    fontSize: 14,
    textAlign: "center",
    flex: 1,
    borderRightWidth: 1,
    borderColor: "gray",
    padding: 10,
  },
  header: {
    marginHorizontal: 20,
    marginBottom: 10,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 50,
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
