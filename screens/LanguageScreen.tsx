import { View, Text, TouchableOpacity, Image } from "react-native";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
import * as SecureStore from "expo-secure-store";
import styled from "styled-components";
import "../i18next";
import i18next from "../i18next";

type StartScreenProps = NativeStackScreenProps<RootStackParamList, "StartScreen">;
function savePlayerLanguage(key: string, value: string) {
  SecureStore.setItem(key, value);
}
function getSavedPlayerLanguage(key: string) {
  return SecureStore.getItem(key);
}

const BlockLanguage = styled.TouchableOpacity`
  margin: 25px auto;
  width: 150px;
  height: 250px;
`;
const LanguageImage = styled.Image`
  width: 150px;
  aspect-ratio: 1;
  margin-bottom: 10px;
`;
const LanguageText = styled.Text`
  color: whitesmoke;
  font-size: 20px;
  text-align: center;
`;

export default function LanguageScreen({ navigation }: StartScreenProps) {
  useEffect(() => {
    (async () => {
      const language = await getSavedPlayerLanguage("lng");
      if (language) {
        i18next.changeLanguage(language);
        navigation.navigate("RuleScreen");
      }
    })();
  }, []);

  const changeLanguage = (lng: string): void => {
    savePlayerLanguage("lng", lng);
    i18next.changeLanguage(lng);
    navigation.navigate("RuleScreen");
  };

  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ height: "100%", width: "100%", padding: 10, paddingTop: "10%" }}
    >
      <BlockLanguage onPress={() => changeLanguage("ua")}>
        <LanguageImage source={{ uri: "https://flagcdn.com/w320/ua.png" }}></LanguageImage>
        <LanguageText>Українська</LanguageText>
      </BlockLanguage>
      <BlockLanguage onPress={() => changeLanguage("en")}>
        <LanguageImage source={{ uri: "https://flagcdn.com/w320/gb.png" }}></LanguageImage>
        <LanguageText>English</LanguageText>
      </BlockLanguage>
    </LinearGradient>
  );
}
