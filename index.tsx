import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { WizardProvider } from './context/WizardContext';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <WizardProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </WizardProvider>
    </HelmetProvider>
  </React.StrictMode>
);
