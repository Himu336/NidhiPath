import React from 'react';
import { Stack } from 'expo-router';

export default function BudgetManagerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Budget Manager',
          headerShown: false,
        }}
      />
    </Stack>
  );
}
