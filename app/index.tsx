import { colors } from "@/src/theme/theme";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
      }}
    >
      <Text variant="titleLarge">Hello World</Text>
    </View>
  );
}
