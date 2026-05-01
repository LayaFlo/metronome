import { MD3DarkTheme } from "react-native-paper";

export const colors = {
  background: "#0B0913",
  surface: "#14141A",
  surfaceElevated: "#1D1D27",
  purple: "#A855F7",
  purpleBright: "#C084FC",
  text: "#FFFFFF",
  secondary: "#B6B6C3",
  border: "rgba(255,255,255,0.08)",
};

export const paperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.purple,
    background: colors.background,
    surface: colors.surface,
    onSurface: colors.text,
    secondary: colors.purpleBright,
  },
};
