import React from "react";
import { View, Text, StyleSheet } from "react-native";

const LandingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🏠 Find Your Perfect PG</Text>

      <Text style={styles.subheading}>
        Search and explore PGs with trusted reviews.
      </Text>
    </View>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subheading: {
    marginTop: 10,
    fontSize: 16,
  },
});