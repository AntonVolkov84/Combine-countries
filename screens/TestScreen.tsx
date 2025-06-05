import { View, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import countries from "../Countries.json";

type MainlandScreenProps = NativeStackScreenProps<RootStackParamList, "TestScreen">;

export default function TestScreen({ route, navigation }: MainlandScreenProps) {
  const { t } = useTranslation();
  const antarcticaCountries = countries.filter((country) => country.continents.includes(route.params.mainland));

  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ height: "100%", width: "100%", padding: 10, paddingTop: "10%" }}
    ></LinearGradient>
  );
}
