import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App.tsx';
import { ThemeProvider } from 'antd-style';
import { GlobalStyle } from '@/styles/global.style';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider
      theme={{
        token: {
          borderRadius: 6,
          colorBgLayout: '#f5f5f5',
          colorPrimary: '#1677ff',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
      }}
    >
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
