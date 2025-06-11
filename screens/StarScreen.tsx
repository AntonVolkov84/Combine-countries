import { View, Text } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
type StartScreenProps = NativeStackScreenProps<RootStackParamList, "StarScreen">;
import Button from "../components/Button";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";

const InfoText = styled.Text`
  text-align: center;
  color: whitesmoke;
  font-size: 20px;
  margin-top: 10px;
  margin-bottom: 40px;
`;

export default function StarScreen({ navigation }: StartScreenProps) {
  const { t } = useTranslation();
  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ height: "100%", width: "100%", padding: 10, paddingTop: "10%" }}
    >
      <InfoText>{t("starscreengetstar")}</InfoText>
      <LottieView
        autoPlay
        style={{
          width: "100%",
          aspectRatio: 1 / 1,
          overflow: "hidden",
          marginBottom: 20,
        }}
        source={require("../Animation.json")}
      />
      <Button onPress={() => navigation.navigate("ConditionsScreen")} title={t("tomenu")} />
    </LinearGradient>
  );
}
