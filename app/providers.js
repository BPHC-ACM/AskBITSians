'use client';

import { UserProvider } from '@/context/userContext';
import { Toaster } from 'sonner';

export function Providers({ children }) {
  return (
    <UserProvider>
      {children}
      <Toaster
        position='top-right'
        richColors
        closeButton
        expand={false}
        duration={4000}
      />
    </UserProvider>
  );
}
