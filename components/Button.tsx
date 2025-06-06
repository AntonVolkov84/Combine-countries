import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import styled from "styled-components";
import { LinearGradient } from "expo-linear-gradient";

const ButtonCustom = styled.TouchableOpacity`
  width: 150px;
  height: 50px;
  margin: 0 auto;
  border-radius: 28px;
`;
const ButtonCustomText = styled.Text<{ fontSize?: number }>`
  color: whitesmoke;
  text-align: center;
  font-size: ${({ fontSize }) => fontSize ?? 20}px;
`;

interface ButtonProps {
  title: string;
  onPress?: () => void;
  fontSize?: number;
}
export default function Button({ title, onPress, fontSize }: ButtonProps) {
  return (
    <ButtonCustom onPress={onPress ?? undefined}>
      <LinearGradient
        colors={["#849ae9", "#6ea0eb", "#2db3f1", "#2ab4f1"]}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={{
          height: "100%",
          width: "100%",
          padding: 5,
          overflow: "hidden",
          borderRadius: 15,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ButtonCustomText fontSize={fontSize}>{title}</ButtonCustomText>
      </LinearGradient>
    </ButtonCustom>
  );
}
