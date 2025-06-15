import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import styled from "styled-components";
import Button from "../components/Button";
import { useState, useEffect, useRef } from "react";
import { RootStackParamList } from "../navigationtypes";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AdEventType, InterstitialAd, TestIds, BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import countries_en from "../Countries_en.json";
import countries_ua from "../Countries_ua.json";
import { useIsFocused } from "@react-navigation/native";
import i18next from "../i18next";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Banner from "../components/Banner";
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

const BlockInfo = styled.View`
  flex-direction: column;
  margin: 15px auto;
  width: 360px;
  height: 450px;
  justify-content: space-around;
  align-items: center;
  padding-top: 10px;
  position: relative;
`;
const BlockBtn = styled.View`
  flex-direction: row;
  margin-bottom: 50px;
`;
const InfoIcon = styled.Image`
  width: 200px;
  aspect-ratio: 1;
  border-radius: 10px;
  object-fit: contain;
`;
const InfoText = styled.Text`
  color: whitesmoke;
  font-size: 20px;
  text-align: center;
`;
const BlokcMusic = styled.View`
  position: absolute;
  flex-direction: row;
  gap: 20px;
  width: 100px;
  justify-content: center;
  z-index: 2;
`;

const ButtonSound = styled.TouchableOpacity``;

const BlockBanner = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
`;

export default function StudyScreen({ route, navigation }: MainlandScreenProps) {
  const [item, setItem] = useState<FilteredCountry | null>(null);
  const [itemIndex, setItemIndex] = useState<number>(0);
  const { t } = useTranslation();
  const countries = i18next.language === "ua" ? countries_ua : countries_en;
  const allWorld = route.params.mainland === "All world";

  const countryFilteredByMainLand = allWorld
    ? countries
    : countries.filter((country) => country.continents.includes(route.params.mainland));

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
      style={{ height: "100%", width: "100%", padding: 10, paddingTop: "10%" }}
    >
      <BlockInfo>
        <BlokcMusic>
          <ButtonSound
            onPress={() => {
              navigation.replace("LanguageScreen");
            }}
          >
            <MaterialIcons name="language" size={30} color="gold" />
          </ButtonSound>
        </BlokcMusic>
        <InfoIcon source={{ uri: item?.flags.png }}></InfoIcon>
        <InfoText>{`${t("country")}: ${item?.name.common}`}</InfoText>
        <InfoText>{`${t("countryOficial")}: ${item?.name.official}`}</InfoText>
        <InfoText>{`${t("capital")}: ${item?.capital[0]}`}</InfoText>
      </BlockInfo>
      <BlockBtn>
        <Button title={t("back")} onPress={() => decrementIndex()}></Button>
        <Button title={t("next")} onPress={() => incrementIndex()}></Button>
      </BlockBtn>
      <Button title={t("tomenu")} onPress={() => navigation.replace("ConditionsScreen")}></Button>
      <BlockBanner>
        <Banner />
      </BlockBanner>
    </LinearGradient>
  );
}

// {player.playing ? (
//             <ButtonSound onPress={() => player.pause()}>
//               <Feather name="pause-circle" size={30} color="gold" />
//             </ButtonSound>
//           ) : (
//             <ButtonSound onPress={() => player.play()}>
//               <FontAwesome name="play-circle-o" size={30} color="gold" />
//             </ButtonSound>
//           )}
