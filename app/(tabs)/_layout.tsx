import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import type { ComponentProps } from 'react';
import type { IconProps } from '@expo/vector-icons/build/createIconSet';

interface TabBarIconProps extends Omit<IconProps<ComponentProps<typeof FontAwesome>['name']>, 'name'> {
  name: ComponentProps<typeof FontAwesome>['name'];
  color?: string;
}

function TabBarIcon(props: TabBarIconProps) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return <TabsContent />;
}

function TabsContent() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
      }}
    >
       <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="details"
        options={{
          title: 'Details',
          tabBarIcon: ({ color }) => <FontAwesome name="list-alt" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
