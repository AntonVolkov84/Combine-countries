import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, Easing, View } from "react-native";

interface StarsProps {
  stars: number;
}

export default function Stars({ stars }: StarsProps) {
  const animations = useRef<Animated.Value[]>([]);

  useEffect(() => {
    animations.current = Array.from({ length: stars }, (_, i) => new Animated.Value(0));

    animations.current.forEach((anim, index) => {
      Animated.loop(
        Animated.timing(anim, {
          toValue: 1,
          duration: 5000,
          delay: index * 300,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    });
  }, [stars]);

  return (
    <View style={styles.blockStar}>
      {animations.current.map((anim, index) => {
        const rotateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "360deg"],
        });

        return (
          <Animated.Text
            key={index}
            style={[
              styles.starText,
              {
                transform: [{ perspective: 800 }, { rotateY }],
              },
            ]}
          >
            ⭐
          </Animated.Text>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  blockStar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  starText: {
    fontSize: 30,
  },
});
