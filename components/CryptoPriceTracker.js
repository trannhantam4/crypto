import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, RefreshControl, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";

const API_URL = "https://api.coingecko.com/api/v3/simple/price";
const CRYPTO_IDS = ["bitcoin", "ethereum", "usd"];

const CryptoPriceTracker = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const prevCryptoDataRef = useRef([]);
  const [refreshTime, setRefreshTime] = useState(5000);

  useEffect(() => {
    // Initial data fetch
    fetchCryptoData();

    // Set up an interval to refresh every 5 seconds (5000 milliseconds)
    const intervalId = setInterval(() => {
      fetchCryptoData();
    }, refreshTime);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [refreshTime]);

  const handleRefresh = () => {
    // Set the refreshing state to true to display the loading indicator
    setRefreshing(true);

    // Perform your data fetching or refreshing logic here
    // For example, fetch new data from an API

    // After the data fetching is complete, set the refreshing state back to false
    // to hide the loading indicator
    setTimeout(() => {
      setRefreshing(false);
    }, 5000); // Simulate a delay for demonstration purposes; replace with your actual data fetching logic
  };

  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        `${API_URL}?ids=${CRYPTO_IDS.join(",")}&vs_currencies=usd`
      );
      const data = await response.json();

      // Update previousPrice with currentPrice from previous data
      prevCryptoDataRef.current = cryptoData;
      setCryptoData(data);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.refreshContainer}>
        <Text style={styles.refreshLabel}>Refresh Time:</Text>
        <Picker
          style={styles.refreshPicker}
          selectedValue={refreshTime}
          onValueChange={(itemValue, itemIndex) => setRefreshTime(itemValue)}
        >
          <Picker.Item label="5s" value={5000} />
          <Picker.Item label="10s" value={10000} />
        </Picker>
      </View>

      <FlatList
        data={Object.entries(cryptoData)}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => (
          <View style={styles.cryptoItem}>
            <Text style={styles.cryptoName}>{item[0]}</Text>
            <Text style={styles.cryptoPrice}>${item[1].usd}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#000"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  refreshContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  refreshLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  refreshPicker: {
    width: "50%",
    backgroundColor: "#fff",
  },
  cryptoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    elevation: 8,
    backgroundColor: "lightgreen",
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  cryptoName: {
    fontSize: 18,
  },
  cryptoPrice: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CryptoPriceTracker;