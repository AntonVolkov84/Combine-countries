import { Text, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
import Button from "../components/Button";
import { useTranslation } from "react-i18next";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";

type StartScreenProps = NativeStackScreenProps<RootStackParamList, "StarScreen">;

export default function StarScreen({ navigation }: StartScreenProps) {
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={styles.container}
    >
      <Text style={styles.infoText}>{t("starscreengetstar")}</Text>
      <LottieView autoPlay style={styles.animation} source={require("../Animation.json")} />
      <Button onPress={() => navigation.replace("ConditionsScreen")} title={t("tomenu")} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 10,
    paddingTop: "10%",
  },
  infoText: {
    textAlign: "center",
    color: "whitesmoke",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 40,
  },
  animation: {
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
    marginBottom: 20,
  },
});
