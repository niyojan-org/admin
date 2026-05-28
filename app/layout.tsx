import { Source_Code_Pro, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import React from 'react';
import OrganizationService from '@/services/organizations.service';
import JustLandingPage from './just-landing-page';
import AppSidebar from '@/components/layout/AppSidebar';

const sourceCodePro = Source_Code_Pro({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const sourceSans3 = Source_Sans_3({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // throw new Error('fetchOrganization is not implemented yet');
  const organization = await OrganizationService.fetchOrganization();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sourceSans3.variable} ${sourceCodePro.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {!organization ? (
            <JustLandingPage />
          ) : (
            <div className="flex min-h-dvh w-full gap-4 sm:pr-4">
              <AppSidebar />
              <div className="flex-1">{children}</div>
            </div>
          )}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
