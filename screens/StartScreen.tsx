import { View, Text, Image, Dimensions } from "react-native";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components";
import Logo from "../assets/Combine country.png";
import Button from "../components/Button";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
import * as SecureStore from "expo-secure-store";

function getSavedPlayerLanguage(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}
const deviceWidth = Dimensions.get("window").width;
type StartScreenProps = NativeStackScreenProps<RootStackParamList, "StartScreen">;

const StartScreenLogo = styled.Image.attrs({
  resizeMode: "cover",
})`
  aspect-ratio: 1;
  height: ${deviceWidth}px;
  margin-bottom: 30px;
  margin-top: 100px;
`;

export default function StartScreen({ navigation }: StartScreenProps) {
  const getLang = async (): Promise<void> => {
    const language = await getSavedPlayerLanguage("lng");
    if (language) {
      navigation.replace("RuleScreen");
    }
  };
  useEffect(() => {
    getLang();
  }, []);
  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ height: "100%", width: "100%", padding: 10, paddingTop: "10%" }}
    >
      <StartScreenLogo source={Logo}></StartScreenLogo>
      <Button title="Next" onPress={() => navigation.navigate("LanguageScreen")} />
    </LinearGradient>
  );
}
