import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function WelcomeScreen({
  navigation,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Truth Review
      </Text>

      <Text style={styles.subtitle}>
        Find the Best PG with Real Reviews
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("Main")
        }
      >
        <Text style={styles.btnText}>
          Get Started
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },

  button: {
    backgroundColor: "#14B8A6",
    marginTop: 30,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});