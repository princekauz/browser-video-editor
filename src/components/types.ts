export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}
