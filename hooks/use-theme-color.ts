import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

type ThemeProps = {
  light?: string;
  dark?: string;
};

export function useThemeColor(
  props: ThemeProps,
  colorName: ColorName
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme][colorName];
}