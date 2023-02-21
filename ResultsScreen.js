import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import Database from "./Database.js";

const ResultsScreen = ({ navigation, route }) => {
  const { studentId, selectedYear, selectedSemester } = route.params;
  const [results, setResults] = React.useState([]);
  const [error, setError] = React.useState("");

  const db = new Database();

  React.useEffect(() => {
    db.getGrades(studentId, selectedYear, selectedSemester)
      .then((results) => {
        setResults(results);
        setError("");
      })
      .catch((error) => setError(error));
  }, [studentId, selectedYear, selectedSemester]);

  const renderTable = () => {
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }
    if (results.length === 0) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No results found.</Text>
        </View>
      );
    }
    const tableHead = ["Subject", "Grade", "Year"];
    const tableData = results.map((result) => [
      result.subject_name,
      result.grade,
      result.year,
    ]);
    return (
      <View style={styles.tableContainer}>
        <Table borderStyle={styles.tableBorder}>
          <Row
            data={tableHead}
            style={styles.head}
            textStyle={styles.headText}
          />
          <Rows data={tableData} textStyle={styles.rowText} />
        </Table>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
      {renderTable()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  buttonContainer: {
    alignSelf: "flex-start",
    marginLeft: 10,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 20,
    color: "red",
  },
  tableContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: "#C1C0B9",
  },
  head: {
    height: 40,
    backgroundColor: "#f1f8ff",
  },
  headText: {
    margin: 6,
    textAlign: "center",
    fontWeight: "bold",
  },
  rowText: {
    margin: 6,
    textAlign: "center",
  },
});

export default ResultsScreen;
