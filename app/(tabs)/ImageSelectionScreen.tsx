import { RootStackParamList } from "@/src/navigation/AppNavigator";
import { colors, globalStyles } from "@/src/styles/globalStyles";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type ImageSelectionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ImageSelection"
>;

const { width } = Dimensions.get("window");

const ImageSelectionScreen = () => {
  const navigation = useNavigation<ImageSelectionScreenNavigationProp>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<"assisted" | "unassisted" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const spinValue = new Animated.Value(0);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const startAnimation = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "Nous avons besoin d'accéder à votre galerie pour sélectionner une image.",
        [{ text: "OK" }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    console.log("Résultat de la galerie:", result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    } else {
      console.log("Sélection annulée ou aucune image.");
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission requise",
        "Nous avons besoin d'accéder à votre caméra pour prendre une photo.",
        [{ text: "OK" }]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    console.log("Résultat de la caméra:", result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    } else {
      console.log("Prise de photo annulée ou aucune image.");
    }
  };

  const handleAnalyze = () => {
    if (!selectedImage || !mode) {
      Alert.alert(
        "Action impossible",
        "Veuillez sélectionner une image et choisir un mode d'analyse.",
        [{ text: "OK" }]
      );
      return;
    }

    setIsProcessing(true);
    startAnimation();

    setTimeout(() => {
      setIsProcessing(false);
      navigation.navigate("Analysis", {
        imageUri: selectedImage,
        assisted: mode === "assisted",
      });
    }, 2000);
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Analyse de Feuille</Text>
          <Text style={styles.subHeader}>
            Sélectionnez votre méthode d'analyse et une image
          </Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Mode d'analyse</Text>
          <View style={styles.modeSelector}>
            <TouchableOpacity
              style={[styles.modeCard, mode === "assisted" && styles.modeCardActive]}
              onPress={() => setMode("assisted")}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={mode === "assisted" ? [colors.primary, colors.primaryDark] : ["#FFFFFF", "#F5F5F5"]}
                style={styles.modeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons
                  name="assistant"
                  size={32}
                  color={mode === "assisted" ? "white" : colors.primary}
                />
                <Text style={[styles.modeTitle, mode === "assisted" && styles.modeTitleActive]}>Assisté</Text>
                <Text style={[styles.modeDescription, mode === "assisted" && styles.modeDescriptionActive]}>
                  Guide pas à pas avec recommandations
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeCard, mode === "unassisted" && styles.modeCardActive]}
              onPress={() => setMode("unassisted")}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={mode === "unassisted" ? [colors.primary, colors.primaryDark] : ["#FFFFFF", "#F5F5F5"]}
                style={styles.modeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons
                  name="flash-auto"
                  size={32}
                  color={mode === "unassisted" ? "white" : colors.primary}
                />
                <Text style={[styles.modeTitle, mode === "unassisted" && styles.modeTitleActive]}>Automatique</Text>
                <Text style={[styles.modeDescription, mode === "unassisted" && styles.modeDescriptionActive]}>
                  Analyse rapide sans assistance
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Source de l'image</Text>
          <View style={styles.imageButtons}>
            <TouchableOpacity
              style={styles.imageSourceButton}
              onPress={pickImage}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["#FFFFFF", "#F5F5F5"]}
                style={styles.buttonGradient}
              >
                <MaterialIcons
                  name="photo-library"
                  size={28}
                  color={colors.primary}
                />
                <Text style={styles.imageButtonText}>Galerie</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imageSourceButton}
              onPress={takePhoto}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={["#FFFFFF", "#F5F5F5"]}
                style={styles.buttonGradient}
              >
                <MaterialIcons
                  name="photo-camera"
                  size={28}
                  color={colors.primary}
                />
                <Text style={styles.imageButtonText}>Caméra</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {selectedImage && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Aperçu</Text>
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.imagePreview}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={() => setSelectedImage(null)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="image-remove"
                  size={20}
                  color={colors.error}
                />
                <Text style={styles.changeImageButtonText}>Changer</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.analyzeButton, (!selectedImage || !mode) && styles.analyzeButtonDisabled]}
          onPress={handleAnalyze}
          disabled={!selectedImage || !mode || isProcessing}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.analyzeButtonGradient}
          >
            {isProcessing ? (
              <>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <MaterialCommunityIcons name="loading" size={24} color="white" />
                </Animated.View>
                <Text style={styles.analyzeButtonText}>Analyse en cours...</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="magnify" size={24} color="white" />
                <Text style={styles.analyzeButtonText}>Lancer l'analyse</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
  header: { marginBottom: 30, alignItems: "center" },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 5,
  },
  subHeader: { fontSize: 16, color: colors.primaryLight, textAlign: "center" },
  sectionContainer: { marginBottom: 25 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 15,
    paddingLeft: 5,
  },
  modeSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
  },
  modeCard: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 120,
  },
  modeCardActive: {
    shadowColor: colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modeGradient: { padding: 20, alignItems: "center", justifyContent: "center" },
  modeTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    color: colors.text,
  },
  modeTitleActive: { color: "white" },
  modeDescription: {
    fontSize: 10,
    color: colors.primaryLight,
    marginTop: 5,
    textAlign: "center",
  },
  modeDescriptionActive: { color: "rgba(255,255,255,0.8)" },
  imageButtons: { flexDirection: "row", justifyContent: "space-between" },
  imageSourceButton: { flex: 1, marginHorizontal: 5 },
  buttonGradient: { padding: 15, alignItems: "center", borderRadius: 12 },
  imageButtonText: { fontSize: 12, color: colors.primary, marginTop: 5 },
  imagePreviewContainer: { alignItems: "center" },
  imagePreview: { width: width - 60, height: 200, borderRadius: 12 },
  changeImageButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  changeImageButtonText: { color: colors.error, marginLeft: 5, fontSize: 12 },
  analyzeButton: { marginTop: 20, borderRadius: 12, overflow: "hidden" },
  analyzeButtonDisabled: { opacity: 0.6 },
  analyzeButtonGradient: {
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  analyzeButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
});

export default ImageSelectionScreen;
