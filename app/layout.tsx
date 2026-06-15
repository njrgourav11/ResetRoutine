import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';

export const metadata: Metadata = {
  title: 'ResetRoutine — Sobriety Tracker, Gym Habits & AI Coach',
  description:
    'Reset your habits, build gym streaks, track smoking/alcohol sobriety milestones, and get personalized support from our NVIDIA AI Sobriety Coach. Try 30 days free!',
  keywords: [
    'routine tracker',
    'sobriety tracker',
    'habit tracker',
    'gym consistency',
    'quit smoking tracker',
    'quit alcohol app',
    'NVIDIA AI coach',
    'ResetRoutine',
  ],
  openGraph: {
    title: 'ResetRoutine — Sobriety Tracker, Gym Habits & AI Coach',
    description: 'Reset your habits, build gym consistency, track sobriety milestones, and chat with an NVIDIA AI health coach.',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

