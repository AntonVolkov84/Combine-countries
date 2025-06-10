import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import Button from "../components/Button";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";

type StartScreenProps = NativeStackScreenProps<RootStackParamList, "RuleScreen">;

const TitleText = styled.Text`
  color: whitesmoke;
  font-size: 20px;
  text-align: center;
  margin-top: 20px;
`;
const TitleDescription = styled.Text`
  color: whitesmoke;
  font-size: 15px;
  margin-top: 10px;
`;

export default function RuleScreen({ navigation }: StartScreenProps) {
  const { t } = useTranslation();
  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ height: "100%", width: "100%", padding: 10, paddingTop: "10%" }}
    >
      <TitleText>{t("ruleTitle")}</TitleText>
      <TitleDescription>{t("ruleDescription")}</TitleDescription>
      <TitleText>{t("ruleTimer")}</TitleText>
      <TitleDescription>{t("ruleTimerDescription")}</TitleDescription>
      <TitleText>{t("ruleMistakes")}</TitleText>
      <TitleDescription>{t("ruleMistakesDescription")}</TitleDescription>
      <TitleText>{t("ruleStars")}</TitleText>
      <TitleDescription>{t("ruleStarsDescription")}</TitleDescription>
      <TitleText>{t("ruleHint")}</TitleText>
      <TitleDescription>{t("ruleHintDescription")}</TitleDescription>
      <TitleText>{t("ruleTarget")}</TitleText>
      <TitleDescription style={{ marginBottom: 25 }}>{t("ruleTargetDescription")}</TitleDescription>
      <Button title={t("next")} onPress={() => navigation.navigate("ConditionsScreen")} />
    </LinearGradient>
  );
}
