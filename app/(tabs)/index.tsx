import { RootStackParamList } from '@/src/navigation/AppNavigator';
import { colors, globalStyles } from '@/src/styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// Interface pour les données utilisateur
interface UserData {
  name: string;
  plantsCount: number;
  lastAnalysis: string;
  avatar?: string;
}

// Fonction pour obtenir l'icône météo appropriée
const getWeatherIcon = (weatherCondition: string) => {
  const icons: Record<string, string> = {
    clear: 'weather-sunny',
    clouds: 'weather-cloudy',
    rain: 'weather-rainy',
    thunderstorm: 'weather-lightning',
    snow: 'weather-snowy',
    mist: 'weather-fog',
  };

  return icons[weatherCondition.toLowerCase()] || 'weather-sunny';
};

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherData, setWeatherData] = useState({
    temperature: '--',
    icon: require('../../assets/sunny.avif'),
    description: 'Chargement...',
    humidity: '--',
    windSpeed: '--',
    city: 'Sfax'
  });

  const router = useRouter();
  
  // Données utilisateur
  const [userData] = useState<UserData>({
    name: 'Aminata Touré',
    plantsCount: 12,
    lastAnalysis: new Date().toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }),
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  });

  const fetchWeatherData = async () => {
    try {
      const API_KEY = "e24231c1bf4ce1c06b7ffea320e497e4";
      const CITY = "Sfax";
      const COUNTRY_CODE = "TN";
      
      // 1. Obtenir les coordonnées
      const geoResponse = await axios.get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${CITY},,${COUNTRY_CODE}&limit=1&appid=${API_KEY}`
      );

      if (geoResponse.data.length === 0) return;

      const { lat, lon } = geoResponse.data[0];

      // 2. Obtenir les données météo
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=fr`
      );

      const data = weatherResponse.data;
      setWeatherData({
        temperature: Math.round(data.main.temp).toString(),
        icon: getWeatherIcon(data.weather[0].main),
        description: data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1),
        humidity: `${data.main.humidity}%`,
        windSpeed: `${(data.wind.speed * 3.6).toFixed(1)} km/h`,
        city: data.name
      });
    } catch (error) {
      console.error("Erreur données météo:", error);
      // Valeurs par défaut en cas d'erreur
      setWeatherData(prev => ({
        ...prev,
        description: "Données indisponibles"
      }));
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <ScrollView 
      style={globalStyles.container}
      contentContainerStyle={styles.scrollContainer}
    >
      {/* En-tête avec avatar utilisateur */}
      {/* <View style={styles.header}>
        {userData.avatar && (
          <Image 
            source={{ uri: userData.avatar }} 
            style={styles.avatar} 
          />
        )}
        <View>
          <Text style={styles.welcomeText}>Bonjour,</Text>
          <Text style={styles.userName}>{userData.name}</Text>
        </View>
      </View> */}
      
      {/* Section Météo */}
      <LinearGradient
        colors={['#E3F2FD', '#BBDEFB']}
        style={[globalStyles.card, styles.weatherCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.weatherHeader}>
          <Text style={styles.sectionTitle}>Météo à {weatherData.city}</Text>
          <Icon name="map-marker" size={20} color={colors.primary} />
        </View>
        
        {loadingWeather ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <>
            <View style={styles.weatherMain}>
              <Image 
                source={weatherData.icon} 
                style={styles.weatherIcon} 
                resizeMode="contain"
              />
              <Text style={styles.weatherTemp}>{weatherData.temperature}°C</Text>
            </View>
            <Text style={styles.weatherDescription}>{weatherData.description}</Text>
            
            <View style={styles.weatherDetails}>
              <View style={styles.weatherDetailItem}>
                <Icon name="water" size={20} color={colors.primary} />
                <Text style={styles.weatherDetailText}>{weatherData.humidity}</Text>
              </View>
              <View style={styles.weatherDetailItem}>
                <Icon name="weather-windy" size={20} color={colors.primary} />
                <Text style={styles.weatherDetailText}>{weatherData.windSpeed}</Text>
              </View>
            </View>
          </>
        )}
      </LinearGradient>
      
      {/* Section Utilisateur */}
      <View style={[globalStyles.card, styles.userCard]}>
        <Text style={styles.sectionTitle}>Votre Jardin</Text>
        
        <View style={styles.infoItem}>
          <Icon name="leaf" size={24} color={colors.success} style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Plantes suivies</Text>
            <Text style={styles.infoValue}>{userData.plantsCount}</Text>
          </View>
        </View>
        
        <View style={styles.infoItem}>
          <Icon name="calendar-clock" size={24} color={colors.warning} style={styles.infoIcon} />
          <View>
            <Text style={styles.infoLabel}>Dernière analyse</Text>
            <Text style={styles.infoValue}>{userData.lastAnalysis}</Text>
          </View>
        </View>
      </View>
      
      {/* Boutons d'action */}
      <View style={styles.buttonsContainer}>
        <Button
          title="Analyser une feuille"
          buttonStyle={[globalStyles.button, styles.actionButton]}
          titleStyle={globalStyles.buttonText}
          onPress={() => router.push('/ImageSelectionScreen')}
          icon={<Icon name="camera" size={20} color="white" style={styles.buttonIcon} />}
        />
        
        <Button
          title="Discuter avec l'assistant"
          buttonStyle={[globalStyles.button, styles.actionButton, { backgroundColor: colors.secondary }]}
          titleStyle={globalStyles.buttonText}
          onPress={() => router.push('/ChatScreen')}
          icon={<Icon name="chat" size={20} color="white" style={styles.buttonIcon} />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.primaryLight,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  weatherCard: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.text,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  weatherIcon: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  weatherDescription: {
    fontSize: 16,
    color: colors.primaryLight,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  weatherDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 10,
  },
  weatherDetailText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 5,
  },
  userCard: {
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.primaryLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  buttonsContainer: {
    marginTop: 10,
  },
  actionButton: {
    marginBottom: 15,
    borderRadius: 10,
    paddingVertical: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
});