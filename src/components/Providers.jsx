'use client'; // MUITO IMPORTANTE

import { SessionProvider } from 'next-auth/react';
import { ChakraProvider } from '@chakra-ui/react';
import ReduxProvider from './ReduxProvider';
import theme from '@/lib/theme';

export default function Providers({ children }) {
  return (
    <ChakraProvider theme={theme}>
      <ReduxProvider>
        <SessionProvider>{children}</SessionProvider>
      </ReduxProvider>
    </ChakraProvider>
  );
}
