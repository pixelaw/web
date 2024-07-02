import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.tsx'
import '@/index.css'
import {BrowserRouter} from 'react-router-dom';
import {PixelawProvider} from "@/providers/PixelawProvider.tsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()


console.log(import.meta.env)

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <PixelawProvider>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </PixelawProvider>
        </QueryClientProvider>
    </React.StrictMode>,
)
