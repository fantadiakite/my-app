import HomeScreen from '@/app/(tabs)';
import ChatScreen from '@/app/(tabs)/ChatScreen';
import ImageSelectionScreen from '@/app/(tabs)/ImageSelectionScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

export type RootStackParamList = {
  Home: undefined;
  ImageSelection: undefined;
  Analysis: { imageUri: string; assisted: boolean }; // ✅ Props attendues par AnalysisScreen
  Chat: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Accueil' }} 
        />
        <Stack.Screen 
          name="ImageSelection" 
          component={ImageSelectionScreen} 
          options={{ title: 'Sélection Image' }} 
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ title: 'Assistant' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
