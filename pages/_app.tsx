import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import '../styles/globals.css';
import type { AppProps } from 'next/app'

// DaysJS
import dayjs from 'dayjs';
require('dayjs/locale/da')

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
dayjs.locale('da')


import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'

// Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider withNormalizeCSS emotionOptions={{ key: 'plexit' }}>
        <NotificationsProvider position='top-right'>
          <Component {...pageProps} />
        </NotificationsProvider>
      </MantineProvider>
      <ReactQueryDevtools/>
    </QueryClientProvider>
    )
}

export default MyApp
