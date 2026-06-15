'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Dumbbell, CigaretteOff, Beer, Bot } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

const navItems = [
  { href: '/dashboard', label: 'Overview', Icon: LayoutDashboard, key: 'dashboard' },
  { href: '/gym', label: 'Gym', Icon: Dumbbell, key: 'gym' },
  { href: '/smoke', label: 'Smoking', Icon: CigaretteOff, key: 'smoke' },
  { href: '/alcohol', label: 'Alcohol', Icon: Beer, key: 'alcohol' },
  { href: '/coach', label: 'AI Coach', Icon: Bot, key: 'coach' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { profile } = useAuth();

  const filteredNavItems = navItems.filter((item) => {
    if (item.key === 'dashboard') return true;
    if (profile?.enabledModules) {
      return profile.enabledModules[item.key as keyof typeof profile.enabledModules] !== false;
    }
    return true;
  });

  return (
    <nav className="bottom-nav">
      {filteredNavItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="bottom-nav-icon">
              <item.Icon size={20} />
            </span>
            <span className="bottom-nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

