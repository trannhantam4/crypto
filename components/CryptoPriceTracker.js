import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  FlatList,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LineChart } from "react-native-chart-kit"; // Import LineChart from react-native-chart-kit

const API_URL = "https://api.coingecko.com/api/v3/simple/price";
const CRYPTO_IDS = ["bitcoin", "ethereum", "usd"];

const CryptoPriceTracker = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const prevCryptoDataRef = useRef([]);
  const [refreshTime, setRefreshTime] = useState(5000);
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    // Initial data fetch
    fetchCryptoData();

    // Set up an interval to refresh every specified time
    const intervalId = setInterval(() => {
      fetchCryptoData();
    }, refreshTime);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [refreshTime]);

  useEffect(() => {
    // Add current prices to price history
    if (cryptoData.length > 0) {
      setPriceHistory((prev) => [
        ...prev,
        cryptoData.map((item) => item[1].usd),
      ]);
    }
  }, [cryptoData]);

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
      setCryptoData(Object.entries(data));
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    }
  };

  const chartData = {
    labels: priceHistory.map((_, index) => index.toString()),
    datasets: [
      {
        data: priceHistory.flat(),
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      },
    ],
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

      <LineChart
        data={chartData}
        width={Dimensions.get("window").width - 16}
        height={220}
        chartConfig={{
          backgroundColor: "white",
          backgroundGradientFrom: "white",
          backgroundGradientTo: "white",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        bezier
        style={styles.chart}
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
  chart: {
    marginTop: 16,
  },
});

export default CryptoPriceTracker;
