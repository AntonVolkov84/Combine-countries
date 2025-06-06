import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components";
import cap from "../assets/cap.png";
import exam from "../assets/exam.png";
import flag from "../assets/Flag.png";
import country from "../assets/Country.png";
import capital from "../assets/Capital.png";
import { useTranslation } from "react-i18next";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";
import { useState } from "react";
import Button from "../components/Button";

type StartScreenProps = NativeStackScreenProps<RootStackParamList, "ConditionsScreen">;

const Block = styled.View`
  width: 100%;
  height: 200px;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 25px;
`;
const BlockButton = styled.TouchableOpacity`
  flex-direction: column;
  height: 100%;
  width: 50%;
  border-radius: 10px;
  padding: 5px;
  align-items: center;
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
const Blockinfo = styled.View`
  flex-direction: column;
  width: 90%;
  height: 460px;
  align-self: center;
  margin-bottom: 10px;
`;
const BlockChoose = styled.View`
  width: 100%;
  height: 200px;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;
const BlockIntro = styled.TouchableOpacity<{ selected?: boolean }>`
  width: 30%;
  height: 150px;
  background-color: ${({ selected }) => (selected ? "#307A59" : "green")};
  flex-direction: column;
  border: ${({ selected }) => (selected ? "3px solid white" : "none")};
`;
const IntroImage = styled.Image`
  height: 100px;
  width: 100%;
  object-fit: cover;
`;

export default function ConditionsScreen({ navigation }: StartScreenProps) {
  const { t } = useTranslation();
  const [testVisibility, setTestVisibility] = useState(false);
  const [chooseItem, setChooseItem] = useState<string | null>(null);
  const [chooseItemSecond, setChooseItemSecond] = useState<string | null>(null);
  const data = [
    { itemText: "flag", itemLogo: flag },
    { itemText: "country", itemLogo: country },
    { itemText: "capital", itemLogo: capital },
  ];
  const handlePickCondition = (firstItem: string, secondItem: string): void => {
    if (!chooseItem || !chooseItemSecond) {
      return Alert.alert(`${t("conditionAlert")}`);
    }
    setTestVisibility(false);
    navigation.navigate("MainlandScreen", {
      education: false,
      params: { firstElement: firstItem, secondElement: secondItem },
    });
  };
  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ height: "100%", width: "100%", padding: 10, paddingTop: "10%" }}
    >
      <Block>
        <BlockButton
          onPress={() => {
            setTestVisibility(false);
            navigation.navigate("MainlandScreen", {
              education: true,
            });
          }}
        >
          <BlockButtonImage source={cap}></BlockButtonImage>
          <BlockButtonText>{t("education")}</BlockButtonText>
        </BlockButton>
        <BlockButton onPress={() => setTestVisibility(true)}>
          <BlockButtonImage source={exam}></BlockButtonImage>
          <BlockButtonText>{t("tests")}</BlockButtonText>
        </BlockButton>
        <BlockButton></BlockButton>
      </Block>
      {testVisibility && (
        <>
          <Blockinfo>
            <BlockButtonText>{t("conditionsQuestion")}</BlockButtonText>
            <BlockChoose>
              {data.map((e) => (
                <BlockIntro
                  selected={chooseItem === e.itemText}
                  key={e.itemText}
                  onPress={() => setChooseItem(e.itemText)}
                >
                  <IntroImage source={e.itemLogo}></IntroImage>
                  <BlockButtonText>{t(e.itemText)}</BlockButtonText>
                </BlockIntro>
              ))}
            </BlockChoose>
            <BlockButtonText>{t("conditionsQuestionSecond")}</BlockButtonText>
            <BlockChoose>
              {chooseItem &&
                data
                  .filter((e) => e.itemText !== chooseItem)
                  .map((e) => (
                    <BlockIntro
                      selected={chooseItemSecond === e.itemText}
                      key={e.itemText}
                      onPress={() => setChooseItemSecond(e.itemText)}
                    >
                      <IntroImage source={e.itemLogo}></IntroImage>
                      <BlockButtonText>{t(e.itemText)}</BlockButtonText>
                    </BlockIntro>
                  ))}
            </BlockChoose>
          </Blockinfo>
          <Button title={t("next")} onPress={() => handlePickCondition(chooseItem, chooseItemSecond)} />
        </>
      )}
    </LinearGradient>
  );
}
