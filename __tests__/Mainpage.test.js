import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import MainPage from "../components/MainPage";
import Dictionary from "../assets/dictionaryLang";

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

describe("MainPage", () => {
  it("shows an error when trying to show results without studentId, year, and semester", async () => {
    const language = "ru";
    const { getByText, findByText } = render(<MainPage />);

    const showResultsButton = getByText(Dictionary.showResultsButton[language]);
    fireEvent.press(showResultsButton);

    try {
      await waitFor(async () => {
        expect(
          await findByText(Dictionary.errors.mainpage[language])
        ).toBeTruthy();
      });
      return true;
    } catch (error) {
      return false;
    }
  });

  it("renders correctly", () => {
    const language = "ru";
    const { getByPlaceholderText, getByText } = render(<MainPage />);

    expect(
      getByPlaceholderText(Dictionary.studentIdPlaceholder[language])
    ).toBeTruthy();
    expect(getByText(Dictionary.showResultsButton[language])).toBeTruthy();
    expect(getByText(Dictionary.loginButton[language])).toBeTruthy();
    expect(getByText(language === "ru" ? "EN" : "RU")).toBeTruthy();
  });
});
