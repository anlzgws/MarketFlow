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

  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme][colorName];
}