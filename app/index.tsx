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
import { useEffect, useMemo, useRef, useState } from "react";
import { AppState, ScrollView, StyleSheet, View } from "react-native";
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
  const sliderTapAreaRef = useRef<View>(null);
  const sliderLeftRef = useRef(0);
  const sliderWidthRef = useRef(0);

  const selectedSignature = useMemo(
    () =>
      TIME_SIGNATURES.find((item) => item.value === signature) ??
      TIME_SIGNATURES[2],
    [signature],
  );

  function playClick(isStrongAccent: boolean) {
    if (isMuted) return;

    const player = isStrongAccent ? strongClickPlayer : weakClickPlayer;

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
    onBeat: ({ isAccent, isStrongAccent }) => {
      playClick(isStrongAccent);
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

  function measureSlider() {
    sliderTapAreaRef.current?.measureInWindow((x, _y, width) => {
      sliderLeftRef.current = x;
      sliderWidthRef.current = width;
    });
  }

  function setBpmFromPageX(pageX: number) {
    const sliderWidth = sliderWidthRef.current;

    if (sliderWidth <= 0) return;

    const x = pageX - sliderLeftRef.current;
    const clampedX = Math.max(0, Math.min(sliderWidth, x));
    const percentage = clampedX / sliderWidth;
    const nextBpm = Math.round(MIN_BPM + percentage * (MAX_BPM - MIN_BPM));

    setBpm(nextBpm);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {isRunning ? <RunningKeepAwake /> : null}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topContent}>
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Metronome
            </Text>
            <IconButton
              icon={isMuted ? "volume-off" : "volume-high"}
              iconColor={isMuted ? colors.secondary : colors.text}
              containerColor={isMuted ? colors.surface : undefined}
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
          <View style={styles.sliderOuter}>
            <View
              ref={sliderTapAreaRef}
              onLayout={measureSlider}
              onTouchStart={(event) => {
                measureSlider();
                setBpmFromPageX(event.nativeEvent.pageX);
              }}
              style={styles.sliderTapArea}
            >
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
            </View>
          </View>
        </View>
        <Button
          mode="contained"
          onPress={() => setIsRunning((value) => !value)}
          textColor={colors.text}
          labelStyle={styles.playButtonLabel}
          contentStyle={styles.playButtonContent}
          style={styles.playButton}
          buttonColor={isRunning ? "#7C3AED" : colors.purple}
          accessibilityLabel={isRunning ? "Stop metronome" : "Start metronome"}
        >
          {isRunning ? "Stop" : "Play"}
        </Button>
      </ScrollView>
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
  scrollView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  topContent: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  title: { fontWeight: "700" },
  segmentedButtons: { marginTop: 28 },
  visualizer: {
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 32,
  },
  tempoSection: { alignItems: "center", marginTop: 28 },
  bpm: { fontWeight: "800" },
  bpmLabel: {
    color: colors.secondary,
    letterSpacing: 4,
  },
  sliderOuter: {
    marginTop: 8,
    paddingHorizontal: 20,
  },
  sliderTapArea: {
    height: 48,
    justifyContent: "center",
  },
  slider: { width: "100%", height: 44 },
  playButton: { borderRadius: 66, marginTop: 28, elevation: 0 },
  playButtonContent: { height: 62 },
  playButtonLabel: { fontSize: 18, fontWeight: "700" },
});
