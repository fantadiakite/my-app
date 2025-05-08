import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';

// Définir les couleurs si elles ne sont pas déjà définies
const colors = {
  primary: '#4CAF50',
  secondary: '#2196F3',
  text: '#212121',
  lightText: '#757575',
  background: '#FAFAFA',
};

const globalStyles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.text,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
};

interface AnalysisScreenProps {
  imageUri: string;
  assisted: boolean;
  onChatPress: () => void;
  onBack?: () => void; // Optionnel
}

const AnalysisScreen: React.FC<AnalysisScreenProps> = ({
  imageUri,
  assisted,
  onChatPress,
  onBack
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [result, setResult] = useState<{ status: 'healthy' | 'diseased'; confidence: number; disease?: string } | null>(null);
  const [segmentedImage, setSegmentedImage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockResult = {
        status: Math.random() > 0.5 ? 'healthy' : 'diseased',
        confidence: Math.floor(Math.random() * 30) + 70,
        disease: Math.random() > 0.5 ? 'Mildiou' : 'Rouille',
      };
      setResult(mockResult);
      setSegmentedImage(imageUri);
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [imageUri]);

  return (
    <View style={globalStyles.container}>
      {onBack && (
        <Button
          title="Retour"
          onPress={onBack}
          type="outline"
          buttonStyle={{ marginBottom: 10 }}
        />
      )}

      <Text style={globalStyles.title}>Analyse en cours</Text>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>
            {assisted
              ? "Segmentation et analyse de la feuille..."
              : "Analyse de la feuille..."}
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.imageContainer}>
            {assisted && (
              <>
                <Text style={styles.sectionTitle}>Image segmentée:</Text>
                <Image source={{ uri: segmentedImage || imageUri }} style={styles.resultImage} />
              </>
            )}

            <View style={[globalStyles.card, styles.resultCard]}>
              <Text style={styles.sectionTitle}>Résultats:</Text>

              {result?.status === 'healthy' ? (
                <View style={styles.healthyResult}>
                  <MaterialCommunityIcons name="leaf" size={40} color={colors.primary} />
                  <Text style={styles.healthyText}>Feuille saine</Text>
                  <Text style={styles.confidenceText}>Confiance: {result.confidence}%</Text>
                </View>
              ) : (
                <View style={styles.diseasedResult}>
                  <MaterialCommunityIcons name="leaf-off" size={40} color="#d32f2f" />
                  <Text style={styles.diseasedText}>Feuille malade</Text>
                  <Text style={styles.diseaseType}>Maladie: {result?.disease}</Text>
                  <Text style={styles.confidenceText}>Confiance: {result?.confidence}%</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.adviceContainer}>
            <Text style={styles.sectionTitle}>Conseils:</Text>
            {result?.status === 'healthy' ? (
              <Text style={styles.adviceText}>
                Votre plante semble en bonne santé. Continuez à en prendre soin en maintenant de bonnes conditions de croissance.
              </Text>
            ) : (
              <Text style={styles.adviceText}>
                Nous recommandons de traiter votre plante avec un fongicide approprié. Isolez la plante des autres pour éviter la propagation de la maladie.
              </Text>
            )}
          </View>
            <Button
              title="Discuter avec l'assistant"
              buttonStyle={[globalStyles.button, { backgroundColor: colors.secondary }]}
              titleStyle={globalStyles.buttonText}
              icon={<MaterialCommunityIcons name="chat" size={20} color="white" style={{ marginRight: 10 }} />}
              onPress={onChatPress}
            />
        </>
      )}
    </View>
  );
};

// ... (le reste des styles reste inchangé)
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: colors.text,
  },
  imageContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  resultImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  resultCard: {
    padding: 20,
    alignItems: 'center',
  },
  healthyResult: {
    alignItems: 'center',
  },
  healthyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 10,
  },
  diseasedResult: {
    alignItems: 'center',
  },
  diseasedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginVertical: 10,
  },
  diseaseType: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 5,
  },
  confidenceText: {
    fontSize: 14,
    color: colors.lightText,
  },
  adviceContainer: {
    marginBottom: 20,
  },
  adviceText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
});

export default AnalysisScreen;