<<<<<<< HEAD
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorName
) {
  const theme = useColorScheme();
=======
import { useColorScheme } from 'react-native';

type ThemeProps = {
  light?: string;
  dark?: string;
};

const Colors = {
  light: {
    text: '#11181C',
  },
  dark: {
    text: '#ECEDEE',
  },
};

export function useThemeColor(
  props: ThemeProps,
  colorName: 'text'
) {
  const theme = useColorScheme() ?? 'light';

>>>>>>> 42690ce0d4878a0ec6d7df8560ebcde8b52428b2
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme][colorName];
}