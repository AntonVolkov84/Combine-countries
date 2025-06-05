import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import StartScreen from "./screens/StartScreen";
import LanguageScreen from "./screens/LanguageScreen";
import RuleScreen from "./screens/RuleScreen";
import ConditionsScreen from "./screens/ConditionsScreen";
import MainlandScreen from "./screens/MainlandScreen";
import TestScreen from "./screens/TestScreen";
import * as NavigationBar from "expo-navigation-bar";
import { RootStackParamList } from "./navigationtypes";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const customNavigationBar = async () => {
    await NavigationBar.setBackgroundColorAsync("#1E2322");
    await NavigationBar.setButtonStyleAsync("light");
  };
  useEffect(() => {
    customNavigationBar();
  }, []);
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator initialRouteName="StartScreen">
        <Stack.Screen
          name="StartScreen"
          component={StartScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="LanguageScreen"
          component={LanguageScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="RuleScreen"
          component={RuleScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ConditionsScreen"
          component={ConditionsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MainlandScreen"
          component={MainlandScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="TestScreen"
          component={TestScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
