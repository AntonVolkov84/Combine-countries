import { View, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import countries_en from "../Countries_en.json";
import countries_ua from "../Countries_ua.json";
import Study from "../components/Study";
import i18next from "../i18next";

type MainlandScreenProps = NativeStackScreenProps<RootStackParamList, "TestScreen">;

export default function TestScreen({ route, navigation }: MainlandScreenProps) {
  const countries = i18next.language === "ua" ? countries_ua : countries_en;
  const { t } = useTranslation();
  const countryFilteredByMainLand = countries.filter((country) => country.continents.includes(route.params.mainland));
  const education = route.params.education;
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
        <></>
      )}
    </LinearGradient>
  );
}
