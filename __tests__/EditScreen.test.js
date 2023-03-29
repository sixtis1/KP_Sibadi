import React from "react";
import { fireEvent, render, act, waitFor } from "@testing-library/react-native";
import EditScreen from "../components/EditScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

jest.mock("react-native-dropdown-picker");
jest.mock("@react-native-async-storage/async-storage");
jest.mock("expo-sqlite", () => {
  const mockOpenDatabase = jest.fn(() => ({
    transaction: jest.fn(),
    exec: jest.fn(),
  }));
  return {
    openDatabase: mockOpenDatabase,
  };
});

describe("EditScreen", () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
  });

  it("renders correctly", async () => {
    const language = "ru";
    AsyncStorage.getItem.mockResolvedValue(language);
    AsyncStorage.setItem("language", language);
    const { getByTestId } = render(<EditScreen />);
    await waitFor(() => {
      const editScreen = getByTestId("edit-screen");
      expect(editScreen).toBeTruthy();
    });
  });

  it("changes studentId", async () => {
    const language = "ru";
    AsyncStorage.getItem.mockResolvedValue(language);
    AsyncStorage.setItem("language", language);
    const { getByTestId } = render(<EditScreen />);
    await waitFor(() => {
      const studentIdInput = getByTestId("student-id-input");
      act(() => {
        fireEvent.changeText(studentIdInput, "12345678");
      });
      expect(studentIdInput.props.value).toEqual("12345678");
    });
  });
  it("changes score_1k", async () => {
    const language = "ru";
    AsyncStorage.getItem.mockResolvedValue(language);
    AsyncStorage.setItem("language", language);
    const { getByTestId } = render(<EditScreen />);
    await waitFor(() => {
      const score1Input = getByTestId("score1-input");
      act(() => {
        fireEvent.changeText(score1Input, "80");
      });
      expect(score1Input.props.value).toEqual("80");
    });
  });

  it("changes score_2k", async () => {
    const language = "ru";
    AsyncStorage.getItem.mockResolvedValue(language);
    AsyncStorage.setItem("language", language);
    const { getByTestId } = render(<EditScreen />);
    await waitFor(() => {
      const score2Input = getByTestId("score2-input");
      act(() => {
        fireEvent.changeText(score2Input, "90");
      });
      expect(score2Input.props.value).toEqual("90");
    });
  });

  it("changes finalGrade", async () => {
    const language = "ru";
    AsyncStorage.getItem.mockResolvedValue(language);
    AsyncStorage.setItem("language", language);
    const { getByTestId } = render(<EditScreen />);
    await waitFor(() => {
      const finalGradeInput = getByTestId("final-grade-input");
      act(() => {
        fireEvent.changeText(finalGradeInput, "5");
      });
      expect(finalGradeInput.props.value).toEqual("5");
    });
  });
});
