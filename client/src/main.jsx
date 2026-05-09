import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { store } from './store/store';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <SocketProvider>
            <App />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: 'rgba(22, 22, 46, 0.95)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(108, 99, 255, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(16px)',
                  fontSize: '14px',
                },
                success: { iconTheme: { primary: '#34d399', secondary: '#0d0d1a' } },
                error: { iconTheme: { primary: '#f87171', secondary: '#0d0d1a' } },
              }}
            />
          </SocketProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
