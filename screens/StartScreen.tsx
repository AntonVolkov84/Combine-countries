import { Image, Dimensions, StyleSheet } from "react-native";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/Button";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
import * as SecureStore from "expo-secure-store";

function getSavedPlayerLanguage(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}
const deviceWidth = Dimensions.get("window").width;
type StartScreenProps = NativeStackScreenProps<RootStackParamList, "StartScreen">;

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
      style={styles.container}
    >
      <Image source={require("../assets/Combine country.png")} style={styles.logo} />
      <Button title="Next" onPress={() => navigation.navigate("LanguageScreen")} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    padding: 10,
    paddingTop: "10%",
  },
  logo: {
    aspectRatio: 1,
    height: deviceWidth,
    marginBottom: 30,
    marginTop: 100,
    resizeMode: "cover",
  },
});
