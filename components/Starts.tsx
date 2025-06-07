import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import styled from "styled-components/native";

interface StarsProps {
  stars: number;
}

const BlockStar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

const StarText = styled(Animated.Text)`
  font-size: 30px;
`;

export default function Stars({ stars }: StarsProps) {
  const animations = useRef<Animated.Value[]>([]).current;

  if (animations.length !== stars) {
    animations.splice(0, animations.length, ...Array.from({ length: stars }, () => new Animated.Value(0)));
  }

  useEffect(() => {
    animations.forEach((anim, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000,
            delay: index * 150,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 5000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [animations]);

  return (
    <BlockStar>
      {animations.map((anim, index) => {
        const rotateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "360deg"],
        });

        return (
          <StarText
            key={index}
            style={{
              transform: [
                { perspective: 800 }, // Важно для 3D
                { rotateY },
              ],
            }}
          >
            ⭐
          </StarText>
        );
      })}
    </BlockStar>
  );
}
