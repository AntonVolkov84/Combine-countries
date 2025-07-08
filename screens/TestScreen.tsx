import { View, Text, Alert, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
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
import { AdEventType, RewardedInterstitialAd, RewardedAdEventType, TestIds } from "react-native-google-mobile-ads";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const screenWidth = Dimensions.get("window").width;

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
      Alert.alert(`${t("testalertTimeOff")}`);
      decrementStars();
      navigation.replace("ConditionsScreen");
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
        <View style={styles.blockStars}>
          <Starts stars={stars} />
        </View>
        <View style={styles.blockInfo}>
          <Text style={styles.blockInfoText}>
            {t("seconds")} {seconds}
          </Text>
          <Text style={styles.blockInfoText}>
            {t("mistakes")} {mistakes}
          </Text>
        </View>
        <View style={styles.blockInfo}>
          <Text style={styles.blockInfoText}>
            {t("hints")} {hints}
          </Text>
          <Text style={styles.blockInfoText}>
            {t("answers")} {answers}
          </Text>
        </View>
        <View style={[styles.blockInfo, { marginTop: 20, position: "relative" }]}>
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
          <View style={styles.blokcMusic}>
            <TouchableOpacity style={styles.buttonSound} onPress={() => navigation.replace("LanguageScreen")}>
              <MaterialIcons name="language" size={30} color="gold" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.blockQuestion}>
          <Text style={styles.blockInfoText}>{t("testQuestion")}</Text>
          <Text style={styles.blockInfoText}>{t(firstElement)}:</Text>
          {firstElement === "flag" ? (
            <Image style={styles.blockFlag} source={{ uri: question?.question }} />
          ) : (
            <Text style={[styles.blockInfoText, { marginTop: 10, fontSize: 30 }]}>{question?.question}</Text>
          )}
        </View>
        <Text style={styles.blockInfoText}>{t(secondElement)}:</Text>
        <View style={styles.blockAnswers}>
          {questionLoaded &&
            question!.options.map((option, i) => {
              if (hiddenOptions.includes(option)) return null;
              const displayText = option;
              if (secondElement === "flag") {
                return (
                  <TouchableOpacity style={styles.answerButton} onPress={() => checkAnswer(option)} key={i}>
                    <Image style={styles.answerFlag} source={{ uri: option }} />
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity style={styles.answerButton} onPress={() => checkAnswer(option)} key={i}>
                  <Text style={styles.answerText}>{displayText}</Text>
                </TouchableOpacity>
              );
            })}
        </View>
      </>
      <View style={styles.blockBanner}>
        <Banner />
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  blockStars: {
    width: "100%",
    height: 50,
  },
  blockInfo: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
    flexWrap: "wrap",
  },
  blockInfoText: {
    textAlign: "center",
    color: "whitesmoke",
    fontSize: 20,
    marginTop: 3,
  },
  blockQuestion: {
    flexDirection: "column",
    width: "100%",
    height: 170,
    marginTop: 10,
  },
  blockAnswers: {
    marginTop: 10,
    width: "100%",
    height: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  answerButton: {
    width: "42%",
    height: "40%",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "green",
    marginBottom: 20,
  },
  answerFlag: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  answerText: {
    width: "100%",
    color: "whitesmoke",
    fontSize: 20,
    padding: 10,
    textAlign: "center",
  },
  blockFlag: {
    height: 100,
    width: 150,
    marginTop: 5,
    marginBottom: 5,
    alignSelf: "center",
    resizeMode: "contain",
    borderRadius: 5,
  },
  blokcMusic: {
    position: "absolute",
    flexDirection: "row",
    gap: 20,
    width: 100,
    justifyContent: "center",
    zIndex: 2,
    right: 10,
    top: "20%",
  },
  buttonSound: {},
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
