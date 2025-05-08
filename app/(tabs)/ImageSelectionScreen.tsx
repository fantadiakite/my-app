import { RootStackParamList } from '@/src/navigation/AppNavigator';
import { colors, globalStyles } from '@/src/styles/globalStyles';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ImageSelectionScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ImageSelection'>;

const ImageSelectionScreen = () => {
  const navigation = useNavigation<ImageSelectionScreenNavigationProp>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mode, setMode] = useState<'assisted' | 'unassisted' | null>(null);


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission refusée', 
        'Nous avons besoin de la permission de la caméra pour prendre une photo.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleAnalyze = () => {
    if (!selectedImage || !mode) {
      Alert.alert(
        'Information manquante', 
        'Veuillez sélectionner une image et choisir un mode.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
      );
      return;
    }
    navigation.navigate('Analysis', { imageUri: selectedImage, assisted: mode === 'assisted' });
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Analyser une feuille</Text>

      <Text style={styles.subtitle}>Choisissez le mode d analyse :</Text>
      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'assisted' && styles.modeButtonActive]}
          onPress={() => setMode('assisted')}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name="assistant" 
            size={30} 
            color={mode === 'assisted' ? 'white' : colors.primary} 
          />
          <Text style={[styles.modeText, mode === 'assisted' && styles.modeTextActive]}>
            Avec assistance
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, mode === 'unassisted' && styles.modeButtonActive]}
          onPress={() => setMode('unassisted')}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name="flash-auto" 
            size={30} 
            color={mode === 'unassisted' ? 'white' : colors.primary} 
          />
          <Text style={[styles.modeText, mode === 'unassisted' && styles.modeTextActive]}>
            Sans assistance
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Sélectionnez une image :</Text>
      <View style={styles.imageButtons}>
        <TouchableOpacity
          style={[styles.customButton, { backgroundColor: colors.secondary }]}
          onPress={pickImage}
          activeOpacity={0.7}
        >
          <MaterialIcons name="photo-library" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Choisir une image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.customButton, { backgroundColor: colors.secondary }]}
          onPress={takePhoto}
          activeOpacity={0.7}
        >
          <MaterialIcons name="photo-camera" size={20} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Prendre une photo</Text>
        </TouchableOpacity>
      </View>

      {selectedImage && (
        <View style={styles.imagePreviewContainer}>
          <Text style={styles.subtitle}>Aperçu :</Text>
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
              color={colors.primary} 
              style={styles.buttonIcon} 
            />
            <Text style={styles.changeImageButtonText}>Changer l image</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.customButton, 
          { 
            backgroundColor: (!selectedImage || !mode) ? '#cccccc' : colors.primary,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }
        ]}
        onPress={handleAnalyze}
        disabled={!selectedImage || !mode}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons 
          name="magnify" 
          size={20} 
          color="white" 
          style={styles.buttonIcon} 
        />
        <Text style={styles.buttonText}>Analyser</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginVertical: 10,
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  modeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  modeText: {
    marginTop: 5,
    color: colors.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modeTextActive: {
    color: 'white',
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  customButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
  imagePreviewContainer: {
    marginVertical: 20,
    alignItems: 'center',
    width: '100%',
  },
  imagePreview: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginVertical: 10,
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
  },
  changeImageButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default ImageSelectionScreen;