'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { LayoutDashboard, Dumbbell, CigaretteOff, Beer, Bot, LogOut, Activity, Settings } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Overview', Icon: LayoutDashboard, key: 'dashboard' },
  { href: '/gym', label: 'Gym Tracker', Icon: Dumbbell, key: 'gym' },
  { href: '/smoke', label: 'Quit Smoking', Icon: CigaretteOff, key: 'smoke' },
  { href: '/alcohol', label: 'Quit Alcohol', Icon: Beer, key: 'alcohol' },
  { href: '/coach', label: 'AI Coach', Icon: Bot, key: 'coach' },
  { href: '/settings', label: 'Settings', Icon: Settings, key: 'settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, profile, logout } = useAuth();

  const filteredNavItems = navItems.filter((item) => {
    if (item.key === 'dashboard' || item.key === 'settings') return true;
    if (profile?.enabledModules) {
      return profile.enabledModules[item.key as keyof typeof profile.enabledModules] !== false;
    }
    return true;
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">
          <Activity size={24} style={{ color: 'var(--blue)' }} />
        </span>
        <span className="logo-text">ResetRoutine</span>
      </div>

      <nav className="sidebar-nav">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <item.Icon className="nav-icon" size={18} />
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.displayName?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.displayName ?? 'User'}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={logout} aria-label="Sign out">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
