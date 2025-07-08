import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Button from "./Button";
import { useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
import { useTranslation } from "react-i18next";
import { AdEventType, InterstitialAd, TestIds } from "react-native-google-mobile-ads";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

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

interface StudyProps {
  countryFilteredByMainLand: FilteredCountry[];
  navigation: NavigationProp;
}

const interstatial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
});

export default function Study({ countryFilteredByMainLand, navigation }: StudyProps) {
  const [item, setItem] = useState<FilteredCountry | null>(null);
  const [itemIndex, setItemIndex] = useState<number>(0);
  const [loadedAdvertisement, setLoadedAdvertisement] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    console.log("Study mount");
    return () => console.log("Study unmount");
  }, []);

  useEffect(() => {
    const unsubscribe = interstatial.addAdEventListener(AdEventType.LOADED, () => {
      setLoadedAdvertisement(true);
    });
    const unsubscribeError = interstatial.addAdEventListener(AdEventType.ERROR, (err) => {
      console.log("Interstitial error", err);
    });
    const unsubscribeClose = interstatial.addAdEventListener(AdEventType.CLOSED, () => {
      navigation.navigate("ConditionsScreen");
    });
    interstatial.load();
    return () => {
      unsubscribe();
      unsubscribeError();
      unsubscribeClose();
    };
  }, []);

  useEffect(() => {
    setItem(countryFilteredByMainLand[itemIndex]);
  }, [itemIndex]);

  const incrementIndex = (): void => {
    if (itemIndex === countryFilteredByMainLand.length - 1) {
      setItemIndex(0);
    } else {
      setItemIndex(itemIndex + 1);
    }
  };

  const decrementIndex = (): void => {
    if (itemIndex === 0) {
      setItemIndex(countryFilteredByMainLand.length - 1);
    } else {
      setItemIndex(itemIndex - 1);
    }
  };

  return (
    <>
      <View style={styles.blockInfo}>
        <View style={styles.blockMusic}>
          <TouchableOpacity onPress={() => navigation.navigate("LanguageScreen")}>
            <MaterialIcons name="language" size={30} color="gold" />
          </TouchableOpacity>
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
      <Button
        title={t("tomenu")}
        onPress={() => {
          interstatial.show();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  blockInfo: {
    flexDirection: "column",
    marginVertical: 15,
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
    justifyContent: "center",
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
    right: 0,
  },
});
