'use client';

import { UserProvider } from '@/context/userContext';
import { Toaster } from 'sonner';

export function Providers({ children }) {
  return (
    <UserProvider>
      {children}
      <Toaster
        position='top-center'
        richColors
        closeButton
        expand={true}
        duration={6000}
        visibleToasts={5}
      />
    </UserProvider>
  );
}
