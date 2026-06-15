'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, profileLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isPaywalled, setIsPaywalled] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!profileLoading && profile) {
        if (!profile.onboarded && pathname !== '/onboarding') {
          router.push('/onboarding');
        } else if (profile.onboarded) {
          Promise.resolve().then(() => {
            const createdTime = profile.createdAt?.toDate?.()?.getTime() || Date.now();
            const trialExpired = Date.now() - createdTime > 30 * 24 * 60 * 60 * 1000;
            const isPremium = profile.planType === 'premium';
            const paywallActive = trialExpired && !isPremium;

            setIsPaywalled(paywallActive);

            if (paywallActive) {
              if (pathname !== '/pricing') {
                router.push('/pricing');
              }
            } else {
              if (pathname === '/onboarding') {
                router.push('/dashboard');
              }
            }
          });
        }
      }
    }
  }, [user, profile, loading, profileLoading, router, pathname]);

  if (loading || (user && profileLoading)) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return null;

  // Prevent flash of page content if not onboarded
  if (!profile?.onboarded && pathname !== '/onboarding') {
    return null;
  }

  // Prevent flash of page content if trial expired and not premium
  if (isPaywalled && pathname !== '/pricing') {
    return null;
  }

  return <>{children}</>;
}

