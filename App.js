import { Dimensions, StyleSheet, View, Text } from "react-native";
import CryptoPriceTracker from "./components/CryptoPriceTracker";
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
    backgroundColor: "#fff",
    alignItems: "center",
    flex: 1,
  },
  headers: {
    paddingTop: 100,
    justifyContent: "flex-start",
    fontSize: 30,
    fontWeight: "bold",
  },
});
