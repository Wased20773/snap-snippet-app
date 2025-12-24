import axios from "axios";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type PickedImage = {
  uri: string;
  width: number;
  height: number;
  base64?: string;
};

export default function App() {
  const [image, setImage] = useState<PickedImage | null>(null);
  const [uploading, setUploading] = useState(false);

  /**
   * Take picture → interactive crop → store base64
   */
  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Camera permission is required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // ✅ enables crop UI
      // aspect: [1, 1], // optional
      quality: 1,
      base64: true,
    });

    if (result.canceled) return;

    const asset = result.assets[0];

    setImage({
      uri: asset.uri,
      width: asset.width!,
      height: asset.height!,
      base64: asset.base64 ?? undefined,
    });
  };

  /**
   * Upload cropped image to backend
   */
  const scanPicture = async () => {
    if (!image?.base64) return;

    setUploading(true);
    try {
      const response = await axios.post(
        "http://10.0.0.205:5000/scan",
        {
          image: `data:image/jpeg;base64,${image.base64}`,
          language: "cpp",
        },
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJidmF6cXVlejE3NDVAZ21haWwuY29tIiwiaWF0IjoxNzY2NTM3OTA4LCJleHAiOjE3NjcxNDI3MDh9.DW0vp-QjrdXFAV2N1LBjQM-Thu8TCUE9soFNeqfJrIg",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Scan results:", response.data);
    } catch (err: any) {
      console.error("Scan error:", err.message);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Preview cropped image
   */
  const renderPreview = () => {
    if (!image) return null;

    return (
      <SafeAreaView style={styles.previewContainer}>
        <Image
          source={{ uri: image.uri }}
          style={styles.previewImage}
          contentFit="contain"
        />

        <View style={styles.previewButtons}>
          <Button title="Retake" onPress={() => setImage(null)} />
          <Button
            title={uploading ? "Scanning..." : "Scan Picture"}
            disabled={uploading}
            onPress={scanPicture}
          />
        </View>
      </SafeAreaView>
    );
  };

  return (
    <View style={styles.container}>
      {image ? (
        renderPreview()
      ) : (
        <View style={styles.captureContainer}>
          <Text style={styles.title}>Snap your code snippet</Text>
          <Button title="Take Picture" onPress={takePicture} />
        </View>
      )}
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#252525",
  },
  captureContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "90%",
    height: "75%",
    borderRadius: 12,
  },
  previewButtons: {
    position: "absolute",
    bottom: "8%",
    width: "90%",
    gap: 10,
  },
});
