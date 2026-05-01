import { PulseVisualizer } from "@/src/components/PulseVisualizer";
import {
  DEFAULT_BPM,
  MAX_BPM,
  MIN_BPM,
  TIME_SIGNATURES,
} from "@/src/constants/metronome";
import { useMetronome } from "@/src/hooks/useMetronome";
import { colors } from "@/src/theme/theme";
import Slider from "@react-native-community/slider";
import { useAudioPlayer } from "expo-audio";
import { useKeepAwake } from "expo-keep-awake";
import { useEffect, useMemo, useState } from "react";
import { AppState, StyleSheet, View } from "react-native";
import {
  Button,
  IconButton,
  SegmentedButtons,
  Surface,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import strongClickSource from "../assets/sounds/click-strong.wav";
import weakClickSource from "../assets/sounds/click-weak.wav";

export default function HomeScreen() {
  const weakClickPlayer = useAudioPlayer(weakClickSource);
  const strongClickPlayer = useAudioPlayer(strongClickSource);

  const [isMuted, setIsMuted] = useState(false);
  const [signature, setSignature] = useState("4/4");
  const [bpm, setBpm] = useState(DEFAULT_BPM);
  const [isRunning, setIsRunning] = useState(false);
  const [pulseTrigger, setPulseTrigger] = useState(0);
  const [isAccentBeat, setIsAccentBeat] = useState(true);

  const selectedSignature = useMemo(
    () =>
      TIME_SIGNATURES.find((item) => item.value === signature) ??
      TIME_SIGNATURES[2],
    [signature],
  );

  function playClick(isAccent: boolean) {
    if (isMuted) return;

    const player = isAccent ? strongClickPlayer : weakClickPlayer;

    void player
      .seekTo(0)
      .then(() => player.play())
      .catch((error) => {
        console.warn("Failed to play metronome click", error);
      });
  }

  useMetronome({
    bpm,
    isRunning,
    timeSignature: selectedSignature,
    onBeat: ({ isAccent }) => {
      playClick(isAccent);
      setIsAccentBeat(isAccent);
      setPulseTrigger((value) => value + 1);
    },
  });

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "background") {
        setIsRunning(false);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {isRunning ? <RunningKeepAwake /> : null}
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Metronome
          </Text>
          <IconButton
            icon={isMuted ? "volume-off" : "volume-high"}
            iconColor={colors.text}
            onPress={() => setIsMuted((value) => !value)}
            accessibilityLabel={isMuted ? "Unmute" : "Mute"}
          />
        </View>
        <SegmentedButtons
          value={signature}
          onValueChange={setSignature}
          buttons={TIME_SIGNATURES.map((item) => ({
            value: item.value,
            label: item.label,
          }))}
          style={styles.segmentedButtons}
        />
        <Surface style={styles.visualizer} elevation={0}>
          <PulseVisualizer
            pulseTrigger={pulseTrigger}
            isAccent={isAccentBeat}
            isRunning={isRunning}
          />
        </Surface>
        <View style={styles.tempoSection}>
          <Text variant="displayLarge" style={styles.bpm}>
            {bpm}
          </Text>
          <Text variant="titleMedium" style={styles.bpmLabel}>
            BPM
          </Text>
        </View>
        <Slider
          value={bpm}
          minimumValue={MIN_BPM}
          maximumValue={MAX_BPM}
          step={1}
          onValueChange={setBpm}
          minimumTrackTintColor={colors.purple}
          maximumTrackTintColor={colors.surfaceElevated}
          thumbTintColor={colors.purpleBright}
          style={styles.slider}
        />
        <Button
          mode="contained"
          onPress={() => setIsRunning((value) => !value)}
          textColor={colors.text}
          contentStyle={styles.buttonContent}
          style={styles.button}
          accessibilityLabel={isRunning ? "Stop metronome" : "Start metronome"}
        >
          {isRunning ? "Stop" : "Play"}
        </Button>
      </View>
    </SafeAreaView>
  );
}

function RunningKeepAwake() {
  useKeepAwake("metronome");

  return null;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { fontWeight: "700" },
  segmentedButtons: { marginTop: 12 },
  visualizer: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tempoSection: { alignItems: "center" },
  bpm: { fontWeight: "800" },
  bpmLabel: {
    color: colors.secondary,
    letterSpacing: 4,
  },
  slider: { width: "100%" },
  button: { borderRadius: 66 },
  buttonContent: {
    height: 56,
  },
});
