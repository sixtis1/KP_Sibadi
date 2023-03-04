import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  BackHandler,
  SafeAreaView,
} from "react-native";
import Database from "./Database.js";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditScreen() {
  const navigation = useNavigation();
  const [studentId, setStudentId] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState([]);
  const [subject, setSubject] = useState([]);
  const [score_1k, setFirstGrade] = useState("");
  const [score_2k, setSecondGrade] = useState("");
  const [finalGrade, setFinalGrade] = useState("");
  const [error, setError] = useState(null);
  const [years, setYears] = useState(["Сначала выберите предмет"]);
  const [openYear, setOpenYear] = useState(false);
  const [openSemester, setOpenSemester] = useState(false);
  const [openSubjects, setOpenSubjects] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);

  const db = new Database();

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
    db.getSubj()
      .then((result) => {
        const subjectValue = result.map((item) => item.subject_name);
        setSubjects(subjectValue);
      })
      .catch((error) => {
        console.error("Failed to fetch semesters from DB", error);
        setError("Failed to fetch semesters from DB");
      });
  }, []);

  const getSemestersForSubject = () => {
    db.getSemestersForSubject(subject)
      .then((result) => {
        const semesterValues = result.map((item) => item.semester);
        setSemesters(semesterValues);
      })
      .catch((error) => {
        console.error("Failed to fetch semesters from DB", error);
        setError("Failed to fetch semesters from DB");
      });
  };

  useEffect(() => {
    db.getSemestersForSubject(subject)
      .then((result) => {
        const semesterValues = result.map((item) => item.semester);
        setSemesters(semesterValues);
      })
      .catch((error) => {
        console.error("Failed to fetch semesters from DB", error);
        setError("Failed to fetch semesters from DB");
      });
  }, []);

  const handleGoBack = () => {
    navigation.navigate("Main");
    return 1;
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleGoBack);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleGoBack);
    };
  }, []);

  const handleAddResults = () => {
    if (!score_1k) {
      setError("Введите первый балл");
      console.log(error);
      return;
    }
    if (!score_2k && finalGrade) {
      setError("Введите второй балл");
      console.log(error);
      return;
    }

    db.addScoreAndGrade(
      studentId,
      subject,
      year,
      semester,
      score_1k,
      score_2k,
      finalGrade
    )
      .then((result) => {
        console.log(result);
        setError("");
      })
      .catch((error) => {
        console.error("Failed to fetch semesters from DB", error);
        setError("Failed to fetch semesters from DB");
      });
  };

  const showResults = () => {
    console.log(
      studentId,
      subject,
      year,
      semester,
      score_1k,
      score_2k,
      finalGrade
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.inputContainer, { zIndex: 21 }]}>
        <TextInput
          placeholder="Введите номер зачетки"
          style={[styles.input, { zIndex: 21 }]}
          value={studentId}
          onChangeText={(text) => setStudentId(text)}
          keyboardType="numeric"
          maxLength={8}
        />
      </View>
      <DropDownPicker
        open={openYear}
        value={year}
        placeholder="Выберите год обучения"
        items={years.map((year) => ({
          label: year.toString(),
          value: year,
        }))}
        setOpen={(isOpen) => {
          setOpenYear(isOpen);
          setOpenSubjects(false);
          setOpenSemester(false);
        }}
        setValue={setYear}
        setItems={() => {}}
        containerStyle={[styles.dropdownContainer, { zIndex: 20 }]}
        style={[styles.dropdown]}
        dropDownContainerStyle={[{ width: "77%" }]}
      />
      <DropDownPicker
        open={openSubjects}
        value={subject}
        placeholder="Выберите предмет"
        items={subjects.map((subject) => ({
          label: subject,
          value: subject,
        }))}
        setOpen={(isOpen) => {
          setOpenSubjects(isOpen);
          setOpenYear(false);
          setOpenSemester(false);
          setSemester(["Сначала выберите предмет"]);
        }}
        setValue={setSubject}
        setItems={() => {}}
        containerStyle={[styles.dropdownContainer, { zIndex: 19 }]}
        style={[styles.dropdown]}
        dropDownContainerStyle={[{ width: "77%" }]}
      />
      <DropDownPicker
        open={openSemester}
        onPress={() => getSemestersForSubject()}
        value={semester}
        placeholder="Выберите семестр"
        items={semesters.map((semester) => ({
          label: semester,
          value: semester,
        }))}
        setOpen={(isOpen) => {
          setOpenSemester(isOpen);
          setOpenYear(false);
          setOpenSubjects(false);
        }}
        setValue={setSemester}
        setItems={() => {}}
        containerStyle={[styles.dropdownContainer, { zIndex: 18 }]}
        style={[styles.dropdown]}
        dropDownContainerStyle={[{ width: "77%" }]}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Балл за 1КН"
          onChangeText={setFirstGrade}
          value={score_1k}
          keyboardType="numeric"
          maxLength={2}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Балл за 2КН"
          onChangeText={setSecondGrade}
          value={score_2k}
          keyboardType="numeric"
          maxLength={2}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Оценка"
          onChangeText={setFinalGrade}
          value={finalGrade}
          keyboardType="numeric"
          maxLength={1}
        />
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          showResults();
          handleAddResults();
        }}
      >
        <Text style={styles.buttonText}>Сохранить</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          AsyncStorage.removeItem("isLoggedIn");
          navigation.navigate("Main");
        }}
      >
        <Text style={styles.logoutButtonText}>Выйти</Text>
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingTop: 70,
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
  },

  input: {
    minWidth: "67%",
    height: 45,
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
    maxWidth: "67%",
    minWidth: "55%",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
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
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "tomato",
    borderRadius: 50,
    marginTop: 20,
    color: "white",
    maxWidth: "67%",
    minWidth: "55%",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    zIndex: 14,
    textAlign: "center",
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
