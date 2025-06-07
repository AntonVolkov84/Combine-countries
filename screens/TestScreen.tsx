import { View, Text, Alert } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import countries_en from "../Countries_en.json";
import countries_ua from "../Countries_ua.json";
import Study from "../components/Study";
import i18next from "../i18next";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Starts from "../components/Starts";
import { AdEventType, BannerAd, BannerAdSize, InterstitialAd, TestIds } from "react-native-google-mobile-ads";
interface FilteredCountry {
  flags: {
    png: string;
    alt?: string;
  };
  name: {
    official: string;
    common: string;
  };
  capital: (string | null)[];
  continents: string | string[];
}
interface TestQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}
type ElementKey = "capital" | "country" | "flag";
type MainlandScreenProps = NativeStackScreenProps<RootStackParamList, "TestScreen">;
function savePlayersStars(key: string, value: string): Promise<void> {
  return SecureStore.setItemAsync(key, value);
}
function getSavedPlayersStars(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

const interstatial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL, {
  requestNonPersonalizedAdsOnly: true,
});

const BlockStars = styled.View`
  width: 100%;
  height: 50px;
`;
const BlockInfo = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 5px;
  flex-wrap: wrap;
`;
const BlockInfoText = styled.Text`
  text-align: center;
  color: whitesmoke;
  font-size: 20px;
  margin-top: 5px;
`;

export default function TestScreen({ route, navigation }: MainlandScreenProps) {
  const [stars, setStars] = useState<number>(Number(getSavedPlayersStars("starts")) || 0);
  const [seconds, setSeconds] = useState<number>(1251);
  const [hints, setHints] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [answers, setAnswers] = useState<number>(0);
  const [question, setQuestion] = useState<TestQuestion | null>(null);
  const [loadedAdvertisement, setLoadedAdvertisement] = useState<boolean>(false);
  const countries = i18next.language === "ua" ? countries_ua : countries_en;
  const { t } = useTranslation();
  const allWorld = route.params.mainland === "All world";
  const firstElement = route.params.params?.firstElement;
  const secondElement = route.params.params?.secondElement;

  const countryFiltered = allWorld
    ? countries
    : countries.filter((country) => country.continents.includes(route.params.mainland));
  const education = route.params.education;
  const incrementStars = (): void => {
    const resultStar = stars + 1;
    if (resultStar > 5) {
      savePlayersStars("stars", "0");
      return setStars(0);
    }
    setStars(resultStar);
    savePlayersStars("stars", resultStar.toString());
  };
  const decrementStars = (): void => {
    const resultStar = stars - 1;
    if (resultStar < 0) {
      return;
    }
    setStars(resultStar);
    savePlayersStars("stars", resultStar.toString());
  };
  const decrementHints = (): void => {
    if (hints === 0) {
      return Alert.alert(`${t("testalertHints")}`);
    }
    setHints(hints - 1);
  };
  const incrementMistakes = (): void => {
    if (mistakes === 3) {
      decrementStars();
      return Alert.alert(`${t("testalertMistakes")}`);
    }
    setMistakes(mistakes + 1);
  };
  const incrementAnswers = (): void => {
    if (answers === 10) {
      return incrementStars();
    }
    setAnswers(answers + 1);
  };
  const getRandomIndex = (length: number): number => {
    if (length <= 0) {
      throw new Error("Длина должна быть больше нуля");
    }
    return Math.floor(Math.random() * length);
  };

  function generateTestQuestionSimple(
    data: FilteredCountry[],
    firstElement: ElementKey,
    secondElement: ElementKey
  ): TestQuestion | null {
    if (data.length < 4) return null;

    const getFieldValue = (item: FilteredCountry, key: ElementKey): string => {
      switch (key) {
        case "capital":
          return item.capital?.[0] || "";
        case "country":
          return item.name.common;
        case "flag":
          return item.flags.png;
        default:
          return "";
      }
    };

    const correctIndex = getRandomIndex(data.length);
    const correctItem = data[correctIndex];

    const question = getFieldValue(correctItem, firstElement);
    const correctAnswer = getFieldValue(correctItem, secondElement);

    const wrongOptions = data
      .filter((_, idx) => idx !== correctIndex)
      .map((item) => getFieldValue(item, secondElement))
      .filter((v) => v !== correctAnswer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [...wrongOptions, correctAnswer].sort(() => 0.5 - Math.random());

    return {
      question,
      options,
      correctAnswer,
    };
  }
  const handleNextQuestion = () => {
    const next = generateTestQuestionSimple(countryFiltered, firstElement!, secondElement!);
    if (next) setQuestion(next);
  };
  useEffect(() => {
    const generated = generateTestQuestionSimple(countryFiltered, firstElement!, secondElement!);

    if (generated) {
      setQuestion(generated);
    }
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      Alert.alert(`${t("timerAlert")}`);
      navigation.navigate("MainlandScreen", route.params);
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);
  useEffect(() => {
    const unsubscribe = interstatial.addAdEventListener(AdEventType.LOADED, () => {
      setLoadedAdvertisement(true);
    });
    const unsubscribeClose = interstatial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoadedAdvertisement(false);
      interstatial.load();
      setHints(3);
    });
    interstatial.load();
    return () => {
      unsubscribe();
      unsubscribeClose();
    };
  }, []);
  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ height: "100%", width: "100%", padding: 10, paddingTop: "10%" }}
    >
      {education ? (
        <Study countryFilteredByMainLand={countryFiltered} navigation={navigation}></Study>
      ) : (
        <>
          <BlockStars>
            <Starts stars={stars} />
          </BlockStars>
          <BlockInfo>
            <BlockInfoText>
              {t("seconds")} {seconds}
            </BlockInfoText>
            <BlockInfoText>
              {t("mistakes")} {mistakes}
            </BlockInfoText>
          </BlockInfo>
          <BlockInfo>
            <BlockInfoText>
              {t("hints")} {hints}
            </BlockInfoText>
            <BlockInfoText>
              {t("answers")} {answers}
            </BlockInfoText>
          </BlockInfo>
          <BlockInfo>
            <Button fontSize={15} title={hints === 0 ? t("rewardHints") : `${t("hints")} ${hints}`} />
          </BlockInfo>
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
        </>
      )}
    </LinearGradient>
  );
}
