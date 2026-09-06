import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { WizardProvider } from './context/WizardContext';
import { ConsentProvider } from './context/ConsentContext';
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
        <ConsentProvider>
          <App />
        </ConsentProvider>
      </WizardProvider>
    </HelmetProvider>
  </React.StrictMode>
);
