import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.tsx';
import '@/index.css';
import { BrowserRouter } from 'react-router-dom';
import { PixelawProvider } from '@/providers/PixelawProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProposalSubscription } from '@/hooks/useProposals.ts';

const queryClient = new QueryClient();

// putting it here for now because App updates like Crazy
const Test = () => {
    useProposalSubscription();
    return <></>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <PixelawProvider>
                <BrowserRouter>
                    <App />
                    <Test />
                </BrowserRouter>
            </PixelawProvider>
        </QueryClientProvider>
    </React.StrictMode>,
);
