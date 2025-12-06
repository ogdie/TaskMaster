'use client'; // MUITO IMPORTANTE

import { SessionProvider } from 'next-auth/react';
import ReduxProvider from './ReduxProvider';

export default function Providers({ children }) {
  return (
    <ReduxProvider>
      <SessionProvider>{children}</SessionProvider>
    </ReduxProvider>
  );
}
