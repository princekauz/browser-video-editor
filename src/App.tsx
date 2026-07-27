import { ThemeProvider } from '@/components/theme-provider';
import { MainLayout } from '@/components/layout/main-layout';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="video-editor-theme" enableSystem>
      <MainLayout />
    </ThemeProvider>
  );
}

export default App;
