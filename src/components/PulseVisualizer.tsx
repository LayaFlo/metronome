import { colors } from "@/src/theme/theme";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type PulseVisualizerProps = {
  pulseTrigger: number;
  isAccent: boolean;
  isRunning: boolean;
};

export function PulseVisualizer({
  pulseTrigger,
  isAccent,
  isRunning,
}: PulseVisualizerProps) {
  const rippleScale = useSharedValue(1);
  const orbScale = useSharedValue(1);
  const rippleOpacity = useSharedValue(0.25);

  useEffect(() => {
    if (!isRunning) {
      rippleScale.value = withTiming(1, { duration: 180 });
      orbScale.value = withTiming(1, { duration: 180 });
      rippleOpacity.value = withTiming(0.25, { duration: 180 });
      return;
    }

    const accentScale = isAccent ? 1.18 : 1.1;

    orbScale.value = withSequence(
      withTiming(accentScale, { duration: 80 }),
      withTiming(1, { duration: 160 }),
    );

    rippleScale.value = 1;
    rippleOpacity.value = isAccent ? 0.45 : 0.28;

    rippleScale.value = withTiming(isAccent ? 1.55 : 1.35, { duration: 260 });

    rippleOpacity.value = withTiming(0, { duration: 260 });
  }, [isAccent, isRunning, orbScale, rippleOpacity, rippleScale, pulseTrigger]);

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: rippleScale.value }],
    opacity: rippleOpacity.value,
  }));

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: orbScale.value }],
  }));

  return (
    <>
      <Animated.View style={[styles.ripple, rippleStyle]} />
      <Animated.View style={[styles.orb, orbStyle]} />
    </>
  );
}

const styles = StyleSheet.create({
  ripple: {
    position: "absolute",
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 2,
    borderColor: colors.purple,
  },
  orb: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.purple,
  },
});
