import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function useThemeStyles(createStyles) {
  const { theme } = useTheme();
  return useMemo(() => createStyles(theme), [createStyles, theme]);
}
