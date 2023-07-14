import '../styles/globals.css';

import React from 'react';
import { AppProps } from 'next/app';
import { QueryClientProvider, QueryClient } from 'react-query';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<QueryClientProvider client={new QueryClient()}>
			<Component {...pageProps} />
		</QueryClientProvider>
	);
}

export default MyApp;
