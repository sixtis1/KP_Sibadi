import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function ResultsScreen() {
  const [results, setResults] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
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
    getResults();
  }, []);

  const handleGoBack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.result}>
      <Text style={styles.subject}>{item.subject_name}</Text>
      <Text style={styles.grade}>{item.grade}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Результаты экзаменов</Text>
      <Text style={styles.subtitle}>Студент: {studentId}</Text>
      <Text style={styles.subtitle}>Год: {selectedYear}</Text>
      <Text style={styles.subtitle}>Семестр: {selectedSemester}</Text>
      <FlatList
        style={styles.results}
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.subject_name}
      />
      <Button title="Назад" onPress={handleGoBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5fcff",
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
  results: {
    alignSelf: "stretch",
    marginHorizontal: 20,
    marginTop: 10,
  },
  result: {
    flexDirection: "row",
    marginVertical: 5,
  },
  subject: {
    flex: 1,
    fontSize: 16,
  },
  grade: {
    fontSize: 16,
    fontWeight: "bold",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  resultsContainer: {
    marginTop: 30,
    marginBottom: 60,
    ...Platform.select({
      ios: {
        maxHeight: Dimensions.get("window").height * 0.5,
      },
      android: {
        maxHeight: Dimensions.get("window").height * 0.45,
      },
    }),
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
  backButton: {
    position: "absolute",
    bottom: 20,
  },
});
