import { TouchableOpacity, Text, StyleSheet } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  fontSize?: number;
}

export default function Button({ title, onPress, fontSize }: ButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <LinearGradient
        colors={["#849ae9", "#6ea0eb", "#2db3f1", "#2ab4f1"]}
        start={{ x: 0.0, y: 0.0 }}
        end={{ x: 1.0, y: 1.0 }}
        style={styles.gradient}
      >
        <Text style={[styles.text, fontSize !== undefined ? { fontSize } : null]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 150,
    height: 50,
    marginHorizontal: "auto",
    borderRadius: 28,
  },
  gradient: {
    height: "100%",
    width: "100%",
    padding: 5,
    overflow: "hidden",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "whitesmoke",
    textAlign: "center",
    fontSize: 20,
  },
});
