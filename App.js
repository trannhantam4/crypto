import { Dimensions, StyleSheet, View, Text } from "react-native";
import CryptoPriceTracker from "./components/CryptoPriceTracker";
import { GlobalStyles } from "./constant/styles";
const { width, height } = Dimensions.get("window");
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.headers}>CRYPTO TRACKER</Text>
      <CryptoPriceTracker />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.colors.primary10,
    alignItems: "center",
    flex: 1,
  },
  headers: {
    paddingTop: 100,
    justifyContent: "flex-start",
    fontSize: 30,
    fontWeight: "bold",
    color: GlobalStyles.colors.primary60,
  },
});
