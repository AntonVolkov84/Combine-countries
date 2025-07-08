import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import StartScreen from "./screens/StartScreen";
import LanguageScreen from "./screens/LanguageScreen";
import RuleScreen from "./screens/RuleScreen";
import ConditionsScreen from "./screens/ConditionsScreen";
import MainlandScreen from "./screens/MainlandScreen";
import TestScreen from "./screens/TestScreen";
import StarScreen from "./screens/StarScreen";
import StudyScreen from "./screens/StudyScreen";
import * as NavigationBar from "expo-navigation-bar";
import { RootStackParamList } from "./navigationtypes";
import { AdsConsent, AdsConsentStatus, MobileAds, MaxAdContentRating } from "react-native-google-mobile-ads";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const customNavigationBar = async () => {
    await NavigationBar.setBackgroundColorAsync("#1E2322");
    await NavigationBar.setButtonStyleAsync("light");
  };
  useEffect(() => {
    customNavigationBar();
  }, []);
  useEffect(() => {
    const requestConsentInfo = async () => {
      try {
        await MobileAds().initialize();
        await AdsConsent.requestInfoUpdate();
        await AdsConsent.loadAndShowConsentFormIfRequired();
        const consentStatus = await AdsConsent.gatherConsent();
        if (consentStatus.status === AdsConsentStatus.OBTAINED) {
          console.log("User gave consent!");
        } else if (consentStatus.status === AdsConsentStatus.REQUIRED) {
          console.log("Consent is still required.");
        }
        await MobileAds().setRequestConfiguration({
          tagForChildDirectedTreatment: true,
          tagForUnderAgeOfConsent: true,
          maxAdContentRating: MaxAdContentRating.G,
        });
      } catch (error) {
        console.warn("Consent error:", error);
      }
    };
    requestConsentInfo();
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
            animation: "none",
          }}
        />
        <Stack.Screen
          name="RuleScreen"
          component={RuleScreen}
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
        <Stack.Screen
          name="ConditionsScreen"
          component={ConditionsScreen}
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
        <Stack.Screen
          name="MainlandScreen"
          component={MainlandScreen}
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
        <Stack.Screen
          name="TestScreen"
          component={TestScreen}
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
        <Stack.Screen
          name="StarScreen"
          component={StarScreen}
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
        <Stack.Screen
          name="StudyScreen"
          component={StudyScreen}
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
