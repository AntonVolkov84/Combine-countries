import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigationtypes";

type MainlandScreenProps = NativeStackScreenProps<RootStackParamList, "MainlandScreen">;

export default function MainlandScreen({ route, navigation }: MainlandScreenProps) {
  console.log(route);
  return (
    <LinearGradient
      colors={["#1E2322", "#1F433A", "#1E2322", "#1F433A"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      style={{ height: "100%", width: "100%", padding: 10, paddingTop: "10%" }}
    >
      <Text>MainlandScreen</Text>
    </LinearGradient>
  );
}
