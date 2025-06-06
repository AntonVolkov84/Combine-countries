import { View, Text, Image } from "react-native";
import styled from "styled-components";
import Button from "./Button";
import { useState, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
import { useTranslation } from "react-i18next";

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
  margin: 25px auto;
  width: 360px;
  height: 500px;
  justify-content: space-around;
  align-items: center;
  padding-top: 10px;
`;
const BlockBtn = styled.View`
  flex-direction: row;
  margin-bottom: 50px;
`;
const InfoIcon = styled.Image`
  width: 200px;
  aspect-ratio: 1;
  border-radius: 10px;
`;
const InfoText = styled.Text`
  color: whitesmoke;
  font-size: 20px;
  text-align: center;
`;

export default function Study({ countryFilteredByMainLand, navigation }: StudyProps) {
  const [item, setItem] = useState<FilteredCountry | null>(null);
  const [itemIndex, setItemIndex] = useState<number>(0);
  const { t } = useTranslation();
  useEffect(() => {
    setItem(countryFilteredByMainLand[itemIndex]);
    console.log(itemIndex);
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
        <InfoIcon source={{ uri: item?.flags.png }}></InfoIcon>
        <InfoText>{`${t("country")}: ${item?.name.common}`}</InfoText>
        <InfoText>{`${t("countryOficial")}: ${item?.name.official}`}</InfoText>
        <InfoText>{`${t("capital")}: ${item?.capital[0]}`}</InfoText>
      </BlockInfo>
      <BlockBtn>
        <Button title="Back" onPress={() => decrementIndex()}></Button>
        <Button title="Next" onPress={() => incrementIndex()}></Button>
      </BlockBtn>
      <Button title="Back to menu" onPress={() => navigation.navigate("ConditionsScreen")}></Button>
    </>
  );
}
