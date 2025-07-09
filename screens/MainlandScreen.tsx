import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
import { useTranslation } from "react-i18next";
import Europe from "../assets/Eurasia.png";
import NorthAmerica from "../assets/NorthAmerica.png";
import SouthAmerica from "../assets/SouthAmerica.png";
import Africa from "../assets/Africa.png";
import Asia from "../assets/Asia.png";
import Super from "../assets/supericon.png";
import * as SecureStore from "expo-secure-store";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

type MainlandScreenProps = NativeStackScreenProps<RootStackParamList, "MainlandScreen">;

function getSavedPlayersStars(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

export default function MainlandScreen({ route, navigation }: MainlandScreenProps) {
  const [superLevelVisible, setSuperLevelVisible] = useState<boolean>(false);
  const { t } = useTranslation();

  const data = [
    {
      uri: Africa,
      text: "africa",
      mainland: "Africa",
    },
    {
      uri: SouthAmerica,
      text: "southamerica",
      mainland: "South America",
    },
    {
      uri: NorthAmerica,
      text: "northamerica",
      mainland: "North America",
    },
    {
      uri: Europe,
      text: "europe",
      mainland: "Europe",
    },
    {
      uri: Asia,
      text: "asia",
      mainland: "Asia",
    },
  ];

  const checkStarForSuperLevel = async (): Promise<void> => {
    const starsForSuperLevel = await getSavedPlayersStars("stars");
    if (Number(starsForSuperLevel) >= 4) {
      setSuperLevelVisible(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      checkStarForSuperLevel();
    }, [route.params.forceRefresh])
  );

  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ flex: 1, width: "100%", padding: 10, paddingTop: "10%" }}
    >
      <Text style={styles.mainScreenInfoText}>{t("mainlandInfo")}</Text>
      <View style={styles.block}>
        {superLevelVisible ? (
          <TouchableOpacity
            style={styles.blockButton}
            onPress={() => {
              route.params.education
                ? navigation.navigate("StudyScreen", { ...route.params, mainland: "All world" })
                : navigation.navigate("TestScreen", { ...route.params, mainland: "All world" });
            }}
          >
            <Image source={Super} style={styles.blockButtonImage} />
            <Text style={styles.blockButtonText}>{t("allworld")}</Text>
          </TouchableOpacity>
        ) : (
          <>
            {data.map((e) => (
              <TouchableOpacity
                style={styles.blockButton}
                onPress={() => {
                  route.params.education
                    ? navigation.navigate("StudyScreen", { ...route.params, mainland: e.mainland })
                    : navigation.navigate("TestScreen", { ...route.params, mainland: e.mainland });
                }}
                key={e.text}
              >
                <Image source={e.uri} style={styles.blockButtonImage} />
                <Text style={styles.blockButtonText}>{t(e.text)}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  mainScreenInfoText: {
    color: "whitesmoke",
    fontSize: 20,
    textAlign: "center",
  },
  block: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    flexWrap: "wrap",
  },
  blockButton: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 10,
    padding: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  blockButtonText: {
    textAlign: "center",
    color: "whitesmoke",
    fontSize: 20,
    marginTop: 5,
  },
  blockButtonImage: {
    aspectRatio: 1,
    height: 150,
    borderRadius: 10,
    objectFit: "cover",
  },
});
