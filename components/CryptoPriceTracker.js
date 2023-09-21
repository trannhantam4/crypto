import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { GlobalStyles } from "../constant/styles";
import { LineChart } from "react-native-chart-kit";

const API_URL = "https://api.coingecko.com/api/v3/simple/price";
const CRYPTO_IDS = ["bitcoin", "ethereum", "usd"];
const MAX_HISTORY_LENGTH = 20; // Maximum length of price history

const CryptoPriceTracker = () => {
  const [cryptoData, setCryptoData] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTime, setRefreshTime] = useState(5000);
  const [priceHistory, setPriceHistory] = useState([]);
  const prevCryptoData = useRef({});
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, // optional, default is 3
  };

  const MyLineChart = ({ priceHistory, chartConfig }) => {
    if (priceHistory.length === 0) {
      // Handle the case when priceHistory is empty
      return <Text>No data available</Text>;
    }

    const btcPrices = priceHistory.map((data) => data.btc);
    const ethPrices = priceHistory.map((data) => data.eth);

    return (
      <View>
        <Text style={styles.header}>Price History Line Chart</Text>
        <LineChart
          data={{
            labels: priceHistory.map((_, index) => (index + 1).toString()),
            datasets: [
              {
                data: btcPrices, // Bitcoin (BTC) prices
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Blue color for BTC
              },
              {
                data: ethPrices, // Ethereum (ETH) prices
                color: (opacity = 1) => `rgba(65, 105, 225, ${opacity})`, // Royal Blue color for ETH
              },
            ],
          }}
          width={Dimensions.get("window").width - 16}
          height={220}
          yAxisLabel={"$"}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    );
  };

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
    // Add current prices to price history for Bitcoin and Ethereum
    if (Object.keys(cryptoData).length > 0) {
      setPriceHistory((prev) => {
        const btcPrice = cryptoData["bitcoin"]?.usd || 0;
        const ethPrice = cryptoData["ethereum"]?.usd || 0;

        const updatedHistory = [...prev, { btc: btcPrice, eth: ethPrice }];

        if (updatedHistory.length > MAX_HISTORY_LENGTH) {
          updatedHistory.shift(); // Remove old data
        }
        return updatedHistory;
      });
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
      fetchCryptoData();
      // Refresh data manually
    }, 5000); // Simulate a delay for demonstration purposes; replace with your actual data fetching logic
  };
  const handleCryptoItemPress = (cryptoId) => {
    // Handle the press event for a specific crypto item
    // You can navigate to another screen or perform other actions here
    console.log(`Pressed ${cryptoId}`);
  };
  const fetchCryptoData = async () => {
    try {
      const response = await fetch(
        `${API_URL}?ids=${CRYPTO_IDS.join(",")}&vs_currencies=usd`
      );
      const data = await response.json();

      // Store previous crypto data
      prevCryptoData.current = cryptoData;

      // Update crypto data
      setCryptoData(data);
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.refreshContainer}>
        <Text style={styles.refreshLabel}>Refresh Time: </Text>
        <Picker
          style={styles.refreshPicker}
          selectedValue={refreshTime}
          onValueChange={(itemValue, itemIndex) => setRefreshTime(itemValue)}
        >
          <Picker.Item label="5s" value={5000} />
          <Picker.Item label="10s" value={10000} />
        </Picker>
      </View>
      <MyLineChart priceHistory={priceHistory} chartConfig={chartConfig} />
      <FlatList
        data={CRYPTO_IDS} // Use the array of crypto IDs directly
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleCryptoItemPress(item)}
            style={styles.cryptoItem}
          >
            <Text style={styles.cryptoName}>{item}</Text>
            <Text style={styles.cryptoPrice}>
              ${cryptoData[item]?.usd || "N/A"}
            </Text>
          </TouchableOpacity>
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
    color: GlobalStyles.colors.primary60,
  },
  refreshPicker: {
    width: "50%",
    backgroundColor: GlobalStyles.colors.primary10,
    color: GlobalStyles.colors.primary60,
    fontWeight: "bold",
  },
  cryptoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    elevation: 8,
    backgroundColor: "#fff",
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
