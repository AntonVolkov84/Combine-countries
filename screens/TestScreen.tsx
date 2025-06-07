import { View, Text, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import countries_en from "../Countries_en.json";
import countries_ua from "../Countries_ua.json";
import Study from "../components/Study";
import i18next from "../i18next";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Starts from "../components/Starts";

type MainlandScreenProps = NativeStackScreenProps<RootStackParamList, "TestScreen">;
function savePlayersStars(key: string, value: string): Promise<void> {
  return SecureStore.setItemAsync(key, value);
}
function getSavedPlayersStars(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

const BlockStars = styled.View`
  width: 100%;
  height: 50px;
`;

export default function TestScreen({ route, navigation }: MainlandScreenProps) {
  const [stars, setStars] = useState<number>(Number(getSavedPlayersStars("starts")) || 4);
  const [hints, setHints] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [answers, setAnswers] = useState<number>(0);
  const countries = i18next.language === "ua" ? countries_ua : countries_en;
  const { t } = useTranslation();
  const allWorld = route.params.mainland === "All world";
  const countryFilteredByMainLand = allWorld
    ? countries
    : countries.filter((country) => country.continents.includes(route.params.mainland));
  const education = route.params.education;
  const incrementStars = (): void => {
    const resultStar = stars + 1;
    if (resultStar > 5) {
      savePlayersStars("stars", "0");
      return setStars(0);
    }
    setStars(resultStar);
    savePlayersStars("stars", resultStar.toString());
  };
  const decrementStars = (): void => {
    const resultStar = stars - 1;
    if (resultStar < 0) {
      return;
    }
    setStars(resultStar);
    savePlayersStars("stars", resultStar.toString());
  };
  const decrementHints = (): void => {
    if (hints === 0) {
      return Alert.alert(`${t("testalertHints")}`);
    }
    setHints(hints - 1);
  };
  const incrementMistakes = (): void => {
    if (mistakes === 3) {
      decrementStars();
      return Alert.alert(`${t("testalertMistakes")}`);
    }
    setMistakes(mistakes + 1);
  };
  const incrementAnswers = (): void => {
    if (answers === 10) {
      return incrementStars();
    }
    setAnswers(answers + 1);
  };
  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ height: "100%", width: "100%", padding: 10, paddingTop: "10%" }}
    >
      {education ? (
        <Study countryFilteredByMainLand={countryFilteredByMainLand} navigation={navigation}></Study>
      ) : (
        <BlockStars>
          <Starts stars={stars} />
        </BlockStars>
      )}
    </LinearGradient>
  );
}
