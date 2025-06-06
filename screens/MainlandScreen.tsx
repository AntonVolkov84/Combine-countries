import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Europe from "../assets/Eurasia.png";
import NorthAmerica from "../assets/NorthAmerica.png";
import SouthAmerica from "../assets/SouthAmerica.png";
import Africa from "../assets/Africa.png";
import Asia from "../assets/Asia.png";
import Super from "../assets/supericon.png";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

type MainlandScreenProps = NativeStackScreenProps<RootStackParamList, "MainlandScreen">;

function getSavedPlayersStars(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

const MainScreenInfoText = styled.Text`
  color: whitesmoke;
  font-size: 20px;
  text-align: center;
`;
const Block = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 25px;
  flex-wrap: wrap;
`;
const BlockButton = styled.TouchableOpacity`
  width: 48%;
  aspect-ratio: 1;
  border-radius: 10px;
  padding: 5px;
  align-items: center;
  margin-bottom: 10px;
`;
const BlockButtonText = styled.Text`
  text-align: center;
  color: whitesmoke;
  font-size: 20px;
  margin-top: 5px;
`;
const BlockButtonImage = styled.Image`
  aspect-ratio: 1;
  object-fit: cover;
  height: 150px;
  border-radius: 10px;
`;

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
    if (Number(starsForSuperLevel) > 4) {
      setSuperLevelVisible(true);
    }
  };
  useEffect(() => {
    checkStarForSuperLevel();
  }, []);
  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ height: "100%", width: "100%", padding: 10, paddingTop: "10%" }}
    >
      <MainScreenInfoText>{t("mainlandInfo")}</MainScreenInfoText>
      <Block>
        {data.map((e) => (
          <BlockButton
            onPress={() => {
              navigation.navigate("TestScreen", { ...route.params, mainland: e.mainland });
            }}
            key={e.text}
          >
            <BlockButtonImage source={e.uri}></BlockButtonImage>
            <BlockButtonText>{t(e.text)}</BlockButtonText>
          </BlockButton>
        ))}
        {superLevelVisible && (
          <BlockButton
            onPress={() => {
              navigation.navigate("TestScreen", { ...route.params, mainland: "All world" });
            }}
          >
            <BlockButtonImage source={Super}></BlockButtonImage>
            <BlockButtonText>All world</BlockButtonText>
          </BlockButton>
        )}
      </Block>
    </LinearGradient>
  );
}
