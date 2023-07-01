import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { SWRConfig } from 'swr';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SWRConfig value={{ revalidateOnFocus: false }}>
          <Head>
            <title>Tanstack Query (React) Demo</title>
          </Head>
          <Component {...pageProps} />
          <Toaster position="top-center" />
        </SWRConfig>
      </QueryClientProvider>
    </>
  );
}
