import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginScreen from "../components/LoginScreen";
import Database from "../components/Database";
import Dictionary from "../assets/dictionaryLang";

jest.mock("@react-native-async-storage/async-storage");
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));
jest.mock("../components/Database", () => {
  return jest.fn().mockImplementation(() => {
    return {
      loginFunc: jest.fn(),
    };
  });
});
jest.mock("expo-sqlite", () => ({
  openDatabase: () => ({
    transaction: (callback) => callback({ executeSql: mockExecuteSql }),
  }),
}));

describe("LoginScreen", () => {
  beforeEach(() => {
    AsyncStorage.getItem.mockClear();
    AsyncStorage.clear();
    Database.mockClear();
  });

  it("renders the LoginScreen", async () => {
    const language = "ru";
    AsyncStorage.getItem.mockResolvedValue(language);
    const { getByPlaceholderText } = render(<LoginScreen />);
    AsyncStorage.setItem("language", language);

    await waitFor(() => {
      const loginInput = getByPlaceholderText(
        Dictionary.loginpage.login[language]
      );
      expect(loginInput).toBeTruthy();

      const passwordInput = getByPlaceholderText(
        Dictionary.loginpage.password[language]
      );
      expect(passwordInput).toBeTruthy();
    });
  });

  it("successful login", async () => {
    const language = "ru";
    AsyncStorage.getItem.mockResolvedValue(language);
    const db = new Database();
    db.loginFunc.mockResolvedValue(1);
    AsyncStorage.setItem("language", language);

    const { getByTestId } = render(<LoginScreen />);

    const loginInput = getByTestId("loginInput");
    const passwordInput = getByTestId("passwordInput");
    const loginButton = getByTestId("loginButton");

    await waitFor(async () => {
      fireEvent.changeText(loginInput, "testuser");
      fireEvent.changeText(passwordInput, "testpassword");
      fireEvent.press(loginButton);
    });

    expect(db.loginFunc).toBeTruthy();
  });

  it("displays an error message on failed login", async () => {
    const language = "ru";
    AsyncStorage.getItem.mockResolvedValue(language);
    const { getByPlaceholderText, getByText, queryByText } = render(
      <LoginScreen />
    );
    AsyncStorage.setItem("language", language);

    await waitFor(() => {
      const loginInput = getByPlaceholderText(
        Dictionary.loginpage.login[language]
      );
      expect(loginInput).toBeTruthy();

      const passwordInput = getByPlaceholderText(
        Dictionary.loginpage.password[language]
      );
      expect(passwordInput).toBeTruthy();
    });

    const loginInput = getByPlaceholderText(
      Dictionary.loginpage.login[language]
    );
    const passwordInput = getByPlaceholderText(
      Dictionary.loginpage.password[language]
    );
    const loginButton = getByText(Dictionary.loginpage.enter[language]);

    const mockLoginFunc = jest.fn(() => Promise.reject("Login failed"));
    Database.mockImplementation(() => {
      return {
        loginFunc: mockLoginFunc,
      };
    });

    fireEvent.changeText(loginInput, "testuser");
    fireEvent.changeText(passwordInput, "wrongpassword");
    await act(async () => {
      fireEvent.press(loginButton);
    });

    expect(
      Dictionary.errors.loginpage.wrongLoginOrPassword[language]
    ).toBeTruthy();
  });
});
