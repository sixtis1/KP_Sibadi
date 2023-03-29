import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ResultsScreen from "../components/ResultsScreen";
import Dictionary from "../assets/dictionaryLang";

jest.mock("@react-native-async-storage/async-storage");
jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: jest.fn(),
  };
});
jest.mock("@react-native-async-storage/async-storage", () => {
  return {
    getItem: jest.fn((key) => {
      switch (key) {
        case "language":
          return Promise.resolve("ru");
        default:
          return null;
      }
    }),
    setItem: jest.fn(),
    clear: jest.fn(),
  };
});
describe("ResultsScreen", () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
    AsyncStorage.setItem.mockClear();
    AsyncStorage.clear();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component", async () => {
    const language = "ru";
    AsyncStorage.getItem.mockResolvedValue(language);
    const { getByText } = render(<ResultsScreen />);
    AsyncStorage.setItem("language", language);
    await waitFor(() => {
      const title = getByText(Dictionary.resultsScreen.title[language]);
      expect(title).toBeDefined();
    });
  });

  it("fetches and displays results", async () => {
    const language = "ru";
    AsyncStorage.getItem.mockResolvedValue(language);
    AsyncStorage.getItem.mockImplementation((key) => {
      switch (key) {
        case "results":
          return JSON.stringify([
            {
              subject_name: "Математика",
              score_1k: 90,
              score_2k: 85,
              grade: 5,
            },
          ]);
        case "studentId":
          return "12345";
        case "selectedYear":
          return "2022";
        case "selectedSemester":
          return "1";
        default:
          return null;
      }
    });
    const { getByText } = render(<ResultsScreen />);
    AsyncStorage.setItem("language", language);
    await waitFor(() => {
      expect(getByText(Dictionary.subjects.Математика[language])).toBeDefined();
      expect(getByText("90")).toBeDefined();
      expect(getByText("85")).toBeDefined();
      expect(getByText("5")).toBeDefined();
    });
  });

  it("handles back button press", async () => {
    const language = "ru";
    AsyncStorage.getItem.mockResolvedValue(language);
    const mockNavigate = jest.fn();
    useNavigation.mockReturnValue({ navigate: mockNavigate });

    const { getByText } = render(<ResultsScreen />);
    AsyncStorage.setItem("language", language);
    await waitFor(() => {
      const backButton = getByText(Dictionary.backButton[language]);
      fireEvent.press(backButton);
    });
    expect(mockNavigate).toHaveBeenCalledWith("Main");
    return;
  });
});
