import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import { RootStackParamList } from "../navigationtypes";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import countries_en from "../Countries_en.json";
import countries_ua from "../Countries_ua.json";
import i18next from "../i18next";
import Banner from "../components/Banner";
import { useSoundContext } from "../Soundcontext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
const screenWidth = Dimensions.get("window").width;
type MainlandScreenProps = NativeStackScreenProps<RootStackParamList, "StudyScreen">;

interface FilteredCountry {
  flags: {
    png: string;
    alt: string;
  };
  name: {
    official: string;
    common: string;
  };
  capital: string[] | null[];
  continents: string;
}

export default function StudyScreen({ route, navigation }: MainlandScreenProps) {
  const [item, setItem] = useState<FilteredCountry | null>(null);
  const [itemIndex, setItemIndex] = useState<number>(0);
  const { t } = useTranslation();
  const { playSound, soundPaused, setSoundPaused, soundRef } = useSoundContext();

  const countries = i18next.language === "ua" ? countries_ua : countries_en;
  const allWorld = route.params.mainland === "All world";

  const countryFilteredByMainLand = allWorld
    ? countries
    : countries.filter((country) => country.continents.includes(route.params.mainland));
  useEffect(() => {
    playSound();
    return () => {
      if (soundRef.current) {
        soundRef.current.pauseAsync().catch((e) => {
          console.warn("Failed to pause sound:", e);
        });
      }
    };
  }, []);
  useEffect(() => {
    setItem(countryFilteredByMainLand[itemIndex]);
  }, [itemIndex]);

  const incrementIndex = (): void => {
    if (itemIndex === countryFilteredByMainLand.length - 1) {
      return setItemIndex(0);
    }
    setItemIndex(itemIndex + 1);
  };

  const decrementIndex = (): void => {
    if (itemIndex === 0) {
      return setItemIndex(countryFilteredByMainLand.length - 1);
    }
    setItemIndex(itemIndex - 1);
  };

  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={styles.container}
    >
      <View style={styles.blockInfo}>
        <View style={styles.blockMusic}>
          <TouchableOpacity onPress={() => navigation.replace("LanguageScreen")}>
            <MaterialIcons name="language" size={30} color="gold" />
          </TouchableOpacity>
          {!soundPaused ? (
            <TouchableOpacity
              onPress={async () => {
                if (soundRef.current) {
                  await soundRef.current.pauseAsync();
                  setSoundPaused(true);
                }
              }}
            >
              <Feather name="pause-circle" size={30} color="gold" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={async () => {
                if (soundRef.current) {
                  await soundRef.current.playAsync();
                  setSoundPaused(false);
                }
              }}
            >
              <FontAwesome name="play-circle-o" size={30} color="gold" />
            </TouchableOpacity>
          )}
        </View>
        <Image source={{ uri: item?.flags.png }} style={styles.infoIcon} />
        <Text style={styles.infoText}>{`${t("country")}: ${item?.name.common}`}</Text>
        <Text style={styles.infoText}>{`${t("countryOficial")}: ${item?.name.official}`}</Text>
        <Text style={styles.infoText}>{`${t("capital")}: ${item?.capital[0]}`}</Text>
      </View>
      <View style={styles.blockBtn}>
        <Button title={t("back")} onPress={decrementIndex} />
        <Button title={t("next")} onPress={incrementIndex} />
      </View>
      <Button title={t("tomenu")} onPress={() => navigation.replace("ConditionsScreen")} />
      <View style={styles.blockBanner}>
        <Banner />
      </View>
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
  blockInfo: {
    flexDirection: "column",
    marginHorizontal: "auto",
    width: 360,
    height: 450,
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 10,
    position: "relative",
  },
  blockBtn: {
    flexDirection: "row",
    marginBottom: 50,
    justifyContent: "space-between",
    gap: 20,
  },
  infoIcon: {
    width: 200,
    aspectRatio: 1,
    borderRadius: 10,
    resizeMode: "contain",
  },
  infoText: {
    color: "whitesmoke",
    fontSize: 20,
    textAlign: "center",
  },
  blockMusic: {
    position: "absolute",
    flexDirection: "row",
    gap: 20,
    width: 100,
    justifyContent: "center",
    zIndex: 2,
    top: 0,
  },
  blockBanner: {
    position: "absolute",
    bottom: 0,
    width: screenWidth,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
});
