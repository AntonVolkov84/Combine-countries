import { View, Text, Image, TouchableOpacity } from "react-native";
import styled from "styled-components";
import Button from "./Button";
import { useState, useEffect, useRef } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
import { useTranslation } from "react-i18next";
import { AdEventType, BannerAd, BannerAdSize, InterstitialAd, TestIds } from "react-native-google-mobile-ads";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import Feather from "@expo/vector-icons/Feather";
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
const interstatial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
});

export default function Study({ countryFilteredByMainLand, navigation }: StudyProps) {
  const [item, setItem] = useState<FilteredCountry | null>(null);
  const [itemIndex, setItemIndex] = useState<number>(0);
  const [loadedAdvertisement, setLoadedAdvertisement] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribe = interstatial.addAdEventListener(AdEventType.LOADED, () => {
      setLoadedAdvertisement(true);
      console.log("Loaded");
    });
    const unsubscribeClose = interstatial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoadedAdvertisement(false);
      interstatial.load();
      navigation.navigate("ConditionsScreen");
    });
    const unsubscribeError = interstatial.addAdEventListener(AdEventType.ERROR, (err) => {
      console.log("Interstitial error", err);
    });
    interstatial.load();
    return (): void => {
      unsubscribe();
      unsubscribeClose();
      unsubscribeError();
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
    <>
      <BlockInfo>
        <BlokcMusic>
          <ButtonSound onPress={() => navigation.navigate("LanguageScreen")}>
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
      <Button
        title={t("tomenu")}
        onPress={() => {
          if (loadedAdvertisement) {
            interstatial.show();
          } else {
            navigation.navigate("ConditionsScreen");
          }
        }}
      ></Button>
      <BlockBanner>
        <BannerAd
          unitId={TestIds.ADAPTIVE_BANNER}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
            networkExtras: {
              collapsible: "bottom",
            },
          }}
        />
      </BlockBanner>
    </>
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
