import { RootStackParamList } from '@/src/navigation/AppNavigator';
import { colors, globalStyles } from '@/src/styles/globalStyles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

// Fonction pour obtenir l'icône météo appropriée
const getWeatherIcon = (weatherCondition: string) => {
  switch (weatherCondition.toLowerCase()) {
    case 'clear':
      return require('../../assets/sunny.avif');
    case 'clouds':
      return require('../../assets/cloudy.avif');
    case 'rain':
      return require('../../assets/rainy.avif');
    default:
      return require('../../assets/sunny.avif');
  }
};

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [temperature, setTemperature] = useState('');
  const [weatherIcon, setWeatherIcon] = useState(require('../../assets/sunny.avif'));
  const [weatherDescription, setWeatherDescription] = useState('');
  const [humidity, setHumidity] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  
  // Données utilisateur statiques
  const userData = {
    name: 'Aminata Touré',
    plantsCount: 12,
    lastAnalysis: new Date().toLocaleDateString(),
  };

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

      const weatherData = weatherResponse.data;
      setTemperature(Math.round(weatherData.main.temp).toString());
      setWeatherIcon(getWeatherIcon(weatherData.weather[0].main));
      setWeatherDescription(weatherData.weather[0].description);
      setHumidity(`${weatherData.main.humidity}%`);
      setWindSpeed(`${weatherData.wind.speed} km/h`);
    } catch (error) {
      console.error("Erreur données météo:", error);
      // Valeurs par défaut en cas d'erreur
      setTemperature("24");
      setWeatherDescription("Données indisponibles");
      setHumidity("--");
      setWindSpeed("--");
    } finally {
      setLoadingWeather(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  return (
    <ScrollView style={globalStyles.container}>
      <Text style={globalStyles.title}>Bienvenue, {userData.name} !</Text>
      
      {/* Section Météo */}
      <View style={[globalStyles.card, styles.weatherCard]}>
        <Text style={styles.sectionTitle}>Conditions Météorologiques</Text>
        {loadingWeather ? (
          <Text>Chargement des données météo...</Text>
        ) : (
          <>
            <View style={styles.weatherRow}>
              <Image 
                source={weatherIcon} 
                style={styles.weatherIcon} 
              />
              <Text style={styles.weatherTemp}>{temperature}°C</Text>
            </View>
            <Text style={styles.weatherText}>Condition: {weatherDescription}</Text>
            <Text style={styles.weatherText}>Humidité: {humidity}</Text>
            <Text style={styles.weatherText}>Vent: {windSpeed}</Text>
          </>
        )}
      </View>
      
      {/* Section Utilisateur */}
      <View style={globalStyles.card}>
        <Text style={styles.sectionTitle}>Vos Informations</Text>
        <Text style={styles.infoText}>Nombre de plantes suivies: {userData.plantsCount}</Text>
        <Text style={styles.infoText}>Dernière analyse: {userData.lastAnalysis}</Text>
      </View>
      
      {/* Boutons d'action */}
      <Button
        title="Analyser une feuille"
        buttonStyle={globalStyles.button}
        titleStyle={globalStyles.buttonText}
        onPress={() => navigation.navigate('ImageSelection')}
      />
      
      <Button
        title="Discuter avec l'assistant"
        buttonStyle={[globalStyles.button, { backgroundColor: colors.secondary }]}
        titleStyle={globalStyles.buttonText}
        onPress={() => navigation.navigate('Chat')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  weatherCard: {
    backgroundColor: '#E3F2FD',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  weatherIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  weatherTemp: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  weatherText: {
    fontSize: 16,
    color: colors.lightText,
    marginBottom: 3,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
});