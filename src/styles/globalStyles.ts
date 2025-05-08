import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop:50,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export const colors = {
  // Couleurs principales
  primary: '#2E7D32', // Un vert plus foncé pour une meilleure accessibilité
  primaryLight: '#4CAF50', // Ancien primary comme variante light
  primaryDark: '#1B5E20', // Variante dark
  
  secondary: '#689F38', // Un vert secondaire plus harmonieux
  secondaryLight: '#8BC34A', // Ancien secondary comme variante light
  secondaryDark: '#33691E', // Variante dark
  
  // Arrière-plans
  background: '#F5F7FA', // Un gris plus doux et moderne
  surface: '#FFFFFF', // Pour les composants en surface
  error: '#D32F2F', // Pour les états d'erreur
  
  // Texte
  text: '#212121', // Noir plus doux que #000
  textSecondary: '#424242', // Pour texte moins important
  textLight: '#757575', // Pour texte discret
  textOnPrimary: '#FFFFFF', // Texte sur fond primary
  textOnSecondary: '#FFFFFF', // Texte sur fond secondary
  
  // États et interactions
  disabled: '#BDBDBD',
  border: '#E0E0E0',
  ripple: 'rgba(0, 0, 0, 0.1)',
  
  // Couleurs supplémentaires utiles
  success: '#388E3C', // Pour feedback positif
  warning: '#FFA000', // Pour avertissements
  info: '#1976D2', // Pour informations
};