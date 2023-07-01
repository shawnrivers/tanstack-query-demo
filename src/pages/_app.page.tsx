import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>Tanstack Query (React) Demo</title>
        </Head>
        <div className="mx-auto max-w-lg">
          <main className="px-4 py-8">
            <Component {...pageProps} />
          </main>
        </div>
        <Toaster position="top-center" />
      </QueryClientProvider>
    </>
  );
}
