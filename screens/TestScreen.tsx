import { View, Text, Alert, Image, TouchableOpacity } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import countries_en from "../Countries_en.json";
import countries_ua from "../Countries_ua.json";
import i18next from "../i18next";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import Starts from "../components/Starts";
import Banner from "../components/Banner";
import {
  AdEventType,
  BannerAd,
  BannerAdSize,
  RewardedInterstitialAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

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
async function getSavedPlayersStars(key: string): Promise<string | null> {
  return await SecureStore.getItemAsync(key);
}

const rewardedInterstatial: RewardedInterstitialAd = RewardedInterstitialAd.createForAdRequest(
  TestIds.REWARDED_INTERSTITIAL,
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

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
  margin-top: 3px;
`;
const BlockQuestion = styled.View`
  flex-direction: column;
  width: 100%;
  height: 170px;
  margin-top: 10px;
`;
const BlockAnswers = styled.View`
  margin-top: 10px;
  width: 100%;
  height: 300px;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
`;
const AnswerButton = styled.TouchableOpacity`
  width: 42%;
  height: 40%;
  justify-content: space-around;
  align-items: center;
  border-radius: 5px;
  border-width: 2px;
  border-color: green;
  margin-bottom: 20px;
`;
const AnswerFlag = styled.Image`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
const AnswerText = styled.Text`
  width: 100%;
  color: whitesmoke;
  font-size: 20px;
  padding: 10px;
  text-align: center;
`;

const BlockFlag = styled.Image`
  height: 100px;
  width: 150px;
  margin: 5px auto;
  object-fit: contain;
  border-radius: 5px;
`;

const BlokcMusic = styled.View`
  position: absolute;
  flex-direction: row;
  gap: 20px;
  width: 100px;
  justify-content: center;
  z-index: 2;
  right: 10px;
  top: 20%;
`;

const ButtonSound = styled.TouchableOpacity``;
const BlockBanner = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
`;

export default function TestScreen({ route, navigation }: MainlandScreenProps) {
  const [stars, setStars] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(120);
  const [hints, setHints] = useState<number>(2);
  const [mistakes, setMistakes] = useState<number>(0);
  const [answers, setAnswers] = useState<number>(0);
  const [hiddenOptions, setHiddenOptions] = useState<string[]>([]);
  const [question, setQuestion] = useState<TestQuestion | null>(null);
  const [questionLoaded, setQuestionLoaded] = useState<boolean>(false);
  const [loadedAdvertisement, setLoadedAdvertisement] = useState<boolean>(false);
  const countries = i18next.language === "ua" ? countries_ua : countries_en;
  const { t } = useTranslation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const allWorld = route.params.mainland === "All world";
  const firstElement = route.params.params?.firstElement;
  const secondElement = route.params.params?.secondElement;

  const countryFiltered = allWorld
    ? countries
    : countries.filter((country) => country.continents.includes(route.params.mainland));
  const education = route.params.education;
  const incrementStars = async (): Promise<void> => {
    const resultStar = stars + 1;
    if (resultStar > 5) {
      await savePlayersStars("stars", "0");
      return setStars(0);
    } else {
      await savePlayersStars("stars", resultStar.toString());
    }
  };
  const decrementStars = (): void => {
    const resultStar = stars - 1;
    if (resultStar < 0) {
      return;
    }
    setStars(resultStar);
    savePlayersStars("stars", resultStar.toString());
  };

  const incrementMistakes = (): void => {
    if (mistakes === 3) {
      decrementStars();
    } else {
      setMistakes(mistakes + 1);
    }
  };
  const incrementAnswers = (): void => {
    if (answers === 9) {
      incrementStars();
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
  const takeHint = () => {
    if (!question || hints <= 0) return;

    const wrongOptions = question.options.filter(
      (opt) => opt !== question.correctAnswer && !hiddenOptions.includes(opt)
    );

    if (wrongOptions.length > 0) {
      const optionToHide = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      setHiddenOptions((prev) => [...prev, optionToHide]);
    }

    setHints((prev) => prev - 1);
  };
  const checkAnswer = (answer: string): void => {
    if (answer === question?.correctAnswer) {
      incrementAnswers();
      setHiddenOptions([]);
      return handleNextQuestion();
    }
    incrementMistakes();
    setHiddenOptions([]);
    return handleNextQuestion();
  };

  useEffect(() => {
    if (mistakes === 3) {
      Alert.alert(`${t("testalertMistakes")}`);
      setMistakes(0);
      decrementStars();
      navigation.replace("ConditionsScreen");
    }
  }, [mistakes]);

  useEffect(() => {
    if (answers >= 10) {
      setAnswers(0);
      navigation.replace("StarScreen");
    }
  }, [answers]);

  useEffect(() => {
    async function fetchStars() {
      const saved = await getSavedPlayersStars("stars");
      setStars(saved ? Number(saved) : 0);
    }
    fetchStars();

    const generated = generateTestQuestionSimple(countryFiltered, firstElement!, secondElement!);
    if (generated) {
      setQuestion(generated);
      setQuestionLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (seconds === 0) {
      navigation.replace("MainlandScreen", route.params);
    }
  }, [seconds]);

  useEffect(() => {
    const unsubscribe = rewardedInterstatial.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoadedAdvertisement(true);
    });
    const unsubscribeClose = rewardedInterstatial.addAdEventListener(AdEventType.CLOSED, () => {
      setLoadedAdvertisement(false);

      rewardedInterstatial.load();
    });
    const unsubscribeEarned = rewardedInterstatial.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      setTimeout(() => {
        setHints(reward.amount);
      }, 100);
    });
    const unsubscribeError = rewardedInterstatial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log("rewardedInterstatial", error.message);
    });
    rewardedInterstatial.load();
    return () => {
      unsubscribe();
      unsubscribeClose();
      unsubscribeEarned();
      unsubscribeError();
    };
  }, []);

  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ height: "100%", width: "100%", padding: 10, paddingTop: "10%" }}
    >
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
        <BlockInfo style={{ marginTop: 20, position: "relative" }}>
          <Button
            fontSize={15}
            title={hints === 0 ? t("rewardHints") : `${t("hints")} ${hints}`}
            onPress={() => {
              if (hints === 0) {
                if (loadedAdvertisement) {
                  rewardedInterstatial.show();
                } else {
                  Alert.alert(`${t("testNonAdv")}`);
                }
              } else {
                takeHint();
              }
            }}
          />
          <BlokcMusic>
            <ButtonSound onPress={() => navigation.replace("LanguageScreen")}>
              <MaterialIcons name="language" size={30} color="gold" />
            </ButtonSound>
          </BlokcMusic>
        </BlockInfo>
        <BlockQuestion>
          <BlockInfoText>{t("testQuestion")}</BlockInfoText>
          <BlockInfoText>{t(firstElement)}:</BlockInfoText>
          {firstElement === "flag" ? (
            <BlockFlag source={{ uri: question?.question }}></BlockFlag>
          ) : (
            <BlockInfoText style={{ marginTop: 10, fontSize: 30 }}>{question?.question}</BlockInfoText>
          )}
        </BlockQuestion>
        <BlockInfoText>{t(secondElement)}:</BlockInfoText>
        <BlockAnswers>
          {questionLoaded &&
            question!.options.map((option, i) => {
              if (hiddenOptions.includes(option)) return null;
              const displayText = option;
              if (secondElement === "flag") {
                return (
                  <AnswerButton onPress={() => checkAnswer(option)} key={i}>
                    <AnswerFlag source={{ uri: option }} />
                  </AnswerButton>
                );
              }
              return (
                <AnswerButton onPress={() => checkAnswer(option)} key={i}>
                  <AnswerText>{displayText}</AnswerText>
                </AnswerButton>
              );
            })}
        </BlockAnswers>
      </>
      <BlockBanner>
        <Banner />
      </BlockBanner>
    </LinearGradient>
  );
}
