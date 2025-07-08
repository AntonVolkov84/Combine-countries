import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
import * as SecureStore from "expo-secure-store";
import i18next from "../i18next";

type StartScreenProps = NativeStackScreenProps<RootStackParamList, "LanguageScreen">;

function savePlayerLanguage(key: string, value: string): Promise<void> {
  return SecureStore.setItemAsync(key, value);
}

export default function LanguageScreen({ navigation }: StartScreenProps) {
  const changeLanguage = async (lng: string): Promise<void> => {
    await savePlayerLanguage("lng", lng);
    await i18next.changeLanguage(lng);
    requestAnimationFrame(() => {
      navigation.replace("RuleScreen");
    });
  };

  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ flex: 1, width: "100%", padding: 10, paddingTop: "10%" }}
    >
      <View style={styles.languageContainer}>
        <TouchableOpacity style={styles.blockLanguage} onPress={() => changeLanguage("ua")}>
          <Image source={{ uri: "https://flagcdn.com/w320/ua.png" }} style={styles.languageImage} />
          <Text style={styles.languageText}>Українська</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.languageContainer}>
        <TouchableOpacity style={styles.blockLanguage} onPress={() => changeLanguage("en")}>
          <Image source={{ uri: "https://flagcdn.com/w320/gb.png" }} style={styles.languageImage} />
          <Text style={styles.languageText}>English</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  blockLanguage: {
    margin: 25,
    width: 150,
    height: 250,
  },
  languageContainer: {
    alignItems: "center",
  },
  languageImage: {
    width: 150,
    aspectRatio: 1,
    marginBottom: 10,
  },
  languageText: {
    color: "whitesmoke",
    fontSize: 20,
    textAlign: "center",
  },
});
