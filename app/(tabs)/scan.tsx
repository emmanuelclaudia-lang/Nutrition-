import { Camera, CameraView } from "expo-camera";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { ArrowLeft, ImageIcon, Scan } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? "http://localhost:8081";

export default function ScanScreen() {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const openCamera = async () => {
    const permission = await Camera.requestCameraPermissionsAsync();

    if (permission.status === "granted") {
      setCameraPermission(true);
    }
  };

  const usePhoto = async () => {
    if (!photoUri) return;
    setScanning(true);

    try {
      const base64 = await FileSystem.readAsStringAsync(photoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const res = await fetch(`${API_BASE}/api/scan-food`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image: base64, mediaType: "image/jpeg" }),
      });
      const result = await res.json();
      router.push({
        pathname: "/scan-result",
        params: { result: JSON.stringify(result) },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Allow access to your photos to select a meal image.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync();

    if (photo?.uri) {
      setPhotoUri(photo.uri);
    }
  };

  if (!cameraPermission) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Scan size={52} color="#B8D7A8" />

        <Text style={styles.permissionTitle}>Scan your meal</Text>

        <Text style={styles.permissionText}>
          Take a photo of your food and we will estimate its calories and
          nutrition.
        </Text>

        <Pressable style={styles.permissionButton} onPress={openCamera}>
          <Text style={styles.permissionButtonText}>Allow Camera</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (photoUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photoUri }} style={styles.previewImage} />

        <View style={styles.previewControls}>
          <Pressable
            style={styles.retakeButton}
            onPress={() => setPhotoUri(null)}
          >
            <Text style={styles.retakeText}>Retake</Text>
          </Pressable>

          <Pressable
            style={styles.usePhotoButton}
            onPress={usePhoto}
            disabled={scanning}
          >
            {scanning ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.usePhotoText}>Use Photo</Text>
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.title}>Scan your meal</Text>

            <Text style={styles.subtitle}>
              Place your food inside the frame
            </Text>
          </View>

          {/* Food frame */}
          <View style={styles.frame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          {/* Bottom controls */}
          <View style={styles.bottomControls}>
            <Pressable style={styles.galleryButton} onPress={pickFromGallery}>
              <ImageIcon size={24} color="#FFFFFF" />
              <Text style={styles.galleryText}>Photos</Text>
            </Pressable>

            <Pressable style={styles.captureButton} onPress={takePhoto}>
              <View style={styles.captureInner} />
            </Pressable>

            <View style={styles.placeholder} />
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    backgroundColor: "#0B110D",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  permissionTitle: {
    color: "#F5F5F2",
    fontSize: 28,
    fontWeight: "700",
  },

  permissionText: {
    color: "#92958D",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 12,
    marginBottom: 30,
  },

  permissionButton: {
    backgroundColor: "#B8D7A8",
    paddingVertical: 16,
    paddingHorizontal: 35,
    borderRadius: 14,
  },

  permissionButtonText: {
    color: "#1A1C19",
    fontSize: 16,
    fontWeight: "700",
  },
  container: {
    flex: 1,
    backgroundColor: "#0B110D",
  },

  previewContainer: {
    flex: 1,
    backgroundColor: "#0B110D",
  },

  previewImage: {
    flex: 1,
    width: "100%",
  },

  previewControls: {
    position: "absolute",
    bottom: 45,
    left: 22,
    right: 22,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  retakeButton: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 14,
  },

  retakeText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  usePhotoButton: {
    backgroundColor: "#B8D7A8",
    paddingVertical: 15,
    paddingHorizontal: 28,
    borderRadius: 14,
  },

  usePhotoText: {
    color: "#10110F",
    fontSize: 16,
    fontWeight: "700",
  },

  camera: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 22,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 55,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  instructions: {
    alignItems: "center",
    marginTop: 45,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
  },

  subtitle: {
    color: "#D0D0D0",
    fontSize: 14,
    marginTop: 8,
  },

  frame: {
    width: "88%",
    aspectRatio: 1,
    alignSelf: "center",
    marginTop: 40,
    position: "relative",
  },

  corner: {
    position: "absolute",
    width: 35,
    height: 35,
    borderColor: "#B8D7A8",
  },

  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 12,
  },

  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 12,
  },

  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 12,
  },

  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 12,
  },

  bottomControls: {
    position: "absolute",
    bottom: 45,
    left: 22,
    right: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  galleryButton: {
    alignItems: "center",
    width: 70,
  },

  galleryText: {
    color: "#FFFFFF",
    fontSize: 12,
    marginTop: 4,
  },

  captureButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  captureInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 3,
    borderColor: "#1A1C19",
  },

  galleryIcon: {
    color: "#FFFFFF",
    fontSize: 25,
  },

  placeholder: {
    width: 70,
  },
});
