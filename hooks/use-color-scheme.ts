<<<<<<< HEAD
import { useColorScheme as useNativeColorScheme } from "react-native";

export function useColorScheme() {
  return useNativeColorScheme() ?? "light";
=======
import { useColorScheme as useNativeColorScheme } from 'react-native';

export function useColorScheme() {
  return useNativeColorScheme() ?? 'light';
>>>>>>> 42690ce0d4878a0ec6d7df8560ebcde8b52428b2
}