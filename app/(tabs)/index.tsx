import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

const logoPython = require("../../assets/images/python_logo_icon.png");
const logoCPP = require("../../assets/images/cpp_logo_icon.png");
const logoJS = require("../../assets/images/javascript_logo_icon.png");

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Language</Text>
      <Button
        style={[styles.btn, styles.languageButton, styles.pythonButton]}
        contentStyle={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        mode="contained"
        onPress={() => router.push("/camera")}
      >
        <View style={styles.languageButtonContents}>
          <Image source={logoPython} style={styles.logo} />
          <Text style={styles.languageText}>Python</Text>
        </View>
      </Button>
      <Button
        style={[styles.btn, styles.languageButton, styles.cppButton]}
        contentStyle={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        mode="contained"
        onPress={() => console.log("Pressed")}
      >
        <View style={styles.languageButtonContents}>
          <Image source={logoCPP} style={styles.logo} />
          <Text style={styles.languageText}>C++</Text>
        </View>
      </Button>
      <Button
        style={[styles.btn, styles.languageButton, styles.javascriptButton]}
        contentStyle={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
        mode="contained"
        onPress={() => console.log("Pressed")}
      >
        <View style={styles.languageButtonContents}>
          <Image source={logoJS} style={styles.logo} />
          <Text style={styles.languageText}>JavaScript</Text>
        </View>
      </Button>

      <Text style={{ color: "rgba(255, 255, 255, 0.90)" }}>
        More languages coming soon...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 20,
    gap: 15,
    backgroundColor: "#1E1E1E",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(230, 230, 230, 1)",
    marginBottom: 20,
  },
  btn: {
    borderWidth: 3,
  },
  languageButton: {
    width: "100%",
  },
  pythonButton: {
    backgroundColor: "rgb(219, 219, 219)",
    borderColor: "rgb(37, 79, 115)",
  },
  cppButton: {
    backgroundColor: "rgb(219, 219, 219)",
    borderColor: "rgb(0, 76, 153)",
  },
  javascriptButton: {
    backgroundColor: "rgb(219, 219, 219)",
    borderColor: "rgb(200, 180, 60)",
  },
  languageButtonContents: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  languageText: {
    fontSize: 18,
    color: "rgba(36, 36, 36, 1)",
  },
  comingSoonText: {
    color: "rgba(230, 230, 230, 1)",
    marginTop: 20,
    fontStyle: "italic",
  },
});
