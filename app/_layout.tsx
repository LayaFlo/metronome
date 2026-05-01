import { paperTheme } from "@/src/theme/theme";
import { setAudioModeAsync } from "expo-audio";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  useEffect(() => {
    async function configureAudio() {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: false,
          interruptionMode: "mixWithOthers",
          allowsRecording: false,
          shouldRouteThroughEarpiece: false,
        });
      } catch (error) {
        console.warn("Failed to configure audio mode", error);
      }
    }

    configureAudio();
  }, []);

  return (
    <PaperProvider theme={paperTheme}>
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}
