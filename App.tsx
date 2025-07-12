import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './app/(tabs)/index';
import ProjectDetailsScreen from './app/screen/ProjectDetailsScreen';

export type RootStackParamList = {
  Home: undefined;
  ProjectDetailsScreen: { projectId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProjectDetailsScreen" component={ProjectDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
