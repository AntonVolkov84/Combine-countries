import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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
    navigation.replace("MainlandScreen", {
      education: false,
      forceRefresh: true,
      params: { firstElement: firstItem, secondElement: secondItem },
    });
  };
  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ flex: 1, width: "100%", padding: 10, paddingTop: "10%" }}
    >
      <View style={styles.block}>
        <TouchableOpacity
          style={styles.blockButton}
          onPress={() => {
            setTestVisibility(false);
            navigation.replace("MainlandScreen", {
              forceRefresh: true,
              education: true,
            });
          }}
        >
          <Image source={cap} style={styles.blockButtonImage} />
          <Text style={styles.blockButtonText}>{t("education")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.blockButton} onPress={() => setTestVisibility(true)}>
          <Image source={exam} style={styles.blockButtonImage} />
          <Text style={styles.blockButtonText}>{t("tests")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.blockButton}></TouchableOpacity>
      </View>
      {testVisibility && (
        <View style={{ marginBottom: 10 }}>
          <View style={styles.blockinfo}>
            <Text style={styles.blockButtonText}>{t("conditionsQuestion")}</Text>
            <View style={styles.blockChoose}>
              {data.map((e) => (
                <TouchableOpacity
                  style={[
                    styles.blockIntro,
                    chooseItem === e.itemText && {
                      backgroundColor: "#307A59",
                      borderWidth: 3,
                      borderColor: "white",
                      borderStyle: "solid",
                    },
                  ]}
                  key={e.itemText}
                  onPress={() => setChooseItem(e.itemText)}
                >
                  <Image source={e.itemLogo} style={styles.introImage} />
                  <Text style={styles.blockButtonText}>{t(e.itemText)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.blockButtonText}>{t("conditionsQuestionSecond")}</Text>
            <View style={styles.blockChoose}>
              {chooseItem &&
                data
                  .filter((e) => e.itemText !== chooseItem)
                  .map((e) => (
                    <TouchableOpacity
                      style={[
                        styles.blockIntro,
                        chooseItemSecond === e.itemText && {
                          backgroundColor: "#307A59",
                          borderWidth: 3,
                          borderColor: "white",
                          borderStyle: "solid",
                        },
                      ]}
                      key={e.itemText}
                      onPress={() => setChooseItemSecond(e.itemText)}
                    >
                      <Image source={e.itemLogo} style={styles.introImage} />
                      <Text style={styles.blockButtonText}>{t(e.itemText)}</Text>
                    </TouchableOpacity>
                  ))}
            </View>
          </View>
          <Button title={t("next")} onPress={() => handlePickCondition(chooseItem, chooseItemSecond)} />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  block: {
    width: "100%",
    height: 200,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 25,
  },
  blockButton: {
    flexDirection: "column",
    height: "100%",
    width: "50%",
    borderRadius: 10,
    padding: 5,
    alignItems: "center",
  },
  blockButtonText: {
    textAlign: "center",
    color: "whitesmoke",
    fontSize: 20,
    marginTop: 5,
  },
  blockButtonImage: {
    aspectRatio: 1,
    objectFit: "cover",
    height: 150,
    borderRadius: 10,
  },
  blockinfo: {
    flexDirection: "column",
    width: "90%",
    height: 410,
    alignSelf: "center",
    marginBottom: 15,
  },
  blockChoose: {
    width: "100%",
    height: 180,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  blockIntro: {
    width: "30%",
    height: 150,
    backgroundColor: "green",
    flexDirection: "column",
  },
  introImage: {
    height: 100,
    width: "100%",
    objectFit: "cover",
  },
});
