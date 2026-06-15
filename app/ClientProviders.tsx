'use client';
import { AuthProvider } from '@/components/auth/AuthProvider';

// This wrapper exists so layout.tsx can dynamically import it with ssr:false,
// preventing Firebase from being initialized during server-side rendering.
export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
