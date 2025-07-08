import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";

type StartScreenProps = NativeStackScreenProps<RootStackParamList, "RuleScreen">;

export default function RuleScreen({ navigation }: StartScreenProps) {
  const { t } = useTranslation();

  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t("ruleTitle")}</Text>
        <Text style={styles.description}>{t("ruleDescription")}</Text>

        <Text style={styles.title}>{t("ruleTimer")}</Text>
        <Text style={styles.description}>{t("ruleTimerDescription")}</Text>

        <Text style={styles.title}>{t("ruleMistakes")}</Text>
        <Text style={styles.description}>{t("ruleMistakesDescription")}</Text>

        <Text style={styles.title}>{t("ruleStars")}</Text>
        <Text style={styles.description}>{t("ruleStarsDescription")}</Text>

        <Text style={styles.title}>{t("ruleHint")}</Text>
        <Text style={styles.description}>{t("ruleHintDescription")}</Text>

        <Text style={styles.title}>{t("ruleTarget")}</Text>
        <Text style={[styles.description, { marginBottom: 25 }]}>{t("ruleTargetDescription")}</Text>

        <Button title={t("next")} onPress={() => navigation.navigate("ConditionsScreen")} />
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 40,
  },
  title: {
    color: "whitesmoke",
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
  description: {
    color: "whitesmoke",
    fontSize: 15,
    marginTop: 10,
  },
});
