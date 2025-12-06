import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '../components/Providers'; // Client Component
import { ServiceWorkerRegister } from '../components/ServiceWorkerRegister'; // PWA
import WebVitalsTracker from '../components/WebVitalsTracker'; // Monitoring

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'TaskMaster',
  description: 'Gerenciador de tarefas',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192x192.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        {/* Sentry initialization script */}
        {process.env.NEXT_PUBLIC_SENTRY_DSN && (
          <script
            src="https://browser.sentry-cdn.com/7.95.0/bundle.min.js"
            integrity="sha384-/glz73q3XrWoDg+gRyfJgGc8K/EfJy3L8FePgwKLhPNpU1u5EwrGtvtQjsvr8ZGkh"
            crossOrigin="anonymous"
            async
          />
        )}
      </head>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          <ServiceWorkerRegister />
          <WebVitalsTracker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
