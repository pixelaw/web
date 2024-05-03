import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import { PixelawProvider } from './providers/PixelawProvider.tsx';

const queryClient = new QueryClient()

function init() {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('React root not found');
  const root = ReactDOM.createRoot(rootElement as HTMLElement);
  
  console.log("💟 PixelAW App 💟")
  
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <PixelawProvider>
          <App />
          <ReactQueryDevtools/>
        </PixelawProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

init();
