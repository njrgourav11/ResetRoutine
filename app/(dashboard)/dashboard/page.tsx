'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useWorkouts } from '@/lib/hooks/useWorkouts';
import { useSmoke } from '@/lib/hooks/useSmoke';
import { useAlcohol } from '@/lib/hooks/useAlcohol';
import { StatCard } from '@/components/shared/StatCard';
import Link from 'next/link';
import { 
  Flame, 
  Dumbbell, 
  CigaretteOff, 
  Beer, 
  Coins, 
  Bot, 
  Hourglass, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const { currentStreak, checkins } = useWorkouts();
  const { quitDate: smokeQuitDate, moneySaved: smokeMoneySaved } = useSmoke();
  const { quitDate: alcoholQuitDate, moneySaved: alcoholMoneySaved } = useAlcohol();

  const [smokeDaysFree, setSmokeDaysFree] = useState(0);
  const [alcoholDaysFree, setAlcoholDaysFree] = useState(0);
  const [trialDaysLeft, setTrialDaysLeft] = useState(30);

  useEffect(() => {
    Promise.resolve().then(() => {
      if (smokeQuitDate) {
        setSmokeDaysFree(Math.floor((Date.now() - smokeQuitDate.getTime()) / (1000 * 60 * 60 * 24)));
      } else {
        setSmokeDaysFree(0);
      }
    });
  }, [smokeQuitDate]);

  useEffect(() => {
    Promise.resolve().then(() => {
      if (alcoholQuitDate) {
        setAlcoholDaysFree(Math.floor((Date.now() - alcoholQuitDate.getTime()) / (1000 * 60 * 60 * 24)));
      } else {
        setAlcoholDaysFree(0);
      }
    });
  }, [alcoholQuitDate]);

  useEffect(() => {
    Promise.resolve().then(() => {
      if (profile?.createdAt) {
        const createdTime = profile.createdAt.toDate().getTime();
        const diffMs = Date.now() - createdTime;
        const days = 30 - Math.floor(diffMs / (1000 * 60 * 60 * 24));
        setTrialDaysLeft(Math.max(0, days));
      }
    });
  }, [profile]);

  const gymThisWeek = checkins.filter((c) => {
    const d = new Date(c.date);
    const now = new Date();
    const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7 && c.wentToGym;
  }).length;

  const isPremium = profile?.planType === 'premium';
  const currency = profile?.currency ?? '$';

  const isGymEnabled = profile?.enabledModules?.gym !== false;
  const isSmokeEnabled = profile?.enabledModules?.smoke !== false;
  const isAlcoholEnabled = profile?.enabledModules?.alcohol !== false;
  const isCoachEnabled = profile?.enabledModules?.coach !== false;

  return (
    <div className="page-container">
      {/* Trial / Premium Status Banner */}
      {!isPremium ? (
        <div className="glass-card" style={{
          padding: '12px 20px', borderLeft: '3px solid var(--blue)',
          background: 'rgba(79, 142, 247, 0.03)', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px'
        }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Hourglass size={16} className="text-blue" style={{ color: 'var(--blue)' }} />
            <span><strong>30-Day Free Trial</strong>: {trialDaysLeft} days remaining. Upgrade to lock in your progress!</span>
          </span>
          <Link href="/pricing" className="btn-primary btn-sm" style={{ padding: '6px 12px', fontSize: '12px', background: 'linear-gradient(135deg, var(--blue), #2563eb)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Upgrade</span>
            <Sparkles size={12} />
          </Link>
        </div>
      ) : (
        <div className="glass-card" style={{
          padding: '10px 20px', borderLeft: '3px solid var(--green)',
          background: 'rgba(16, 185, 129, 0.03)', display: 'flex',
          alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--green)'
        }}>
          <Sparkles size={16} />
          <span><strong>Premium Active</strong> — Unlimited tracking and NVIDIA AI support unlocked. Thank you!</span>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.displayName?.split(' ')[0] ?? 'Champ'}</h1>
          <p className="page-sub">Here&apos;s how you&apos;re doing across your health goals today.</p>
        </div>
      </div>

      <div className="stats-grid">
        {isGymEnabled && (
          <>
            <StatCard label="Gym Streak" value={`${currentStreak} days`} icon={<Flame size={20} />} accent="blue" sub="Keep going!" />
            <StatCard label="Gym This Week" value={`${gymThisWeek}/7`} icon={<Dumbbell size={20} />} accent="blue" />
          </>
        )}
        {isSmokeEnabled && (
          <>
            <StatCard label="Smoke-Free" value={`${smokeDaysFree} days`} icon={<CigaretteOff size={20} />} accent="green" sub="Amazing!" />
            <StatCard label="Smoke Money Saved" value={`${currency}${smokeMoneySaved.toFixed(2)}`} icon={<Coins size={20} />} accent="green" />
          </>
        )}
        {isAlcoholEnabled && (
          <>
            <StatCard label="Alcohol-Free" value={`${alcoholDaysFree} days`} icon={<Beer size={20} />} accent="orange" sub="Clarity!" />
            <StatCard label="Alcohol Money Saved" value={`${currency}${alcoholMoneySaved.toFixed(2)}`} icon={<Coins size={20} />} accent="orange" />
          </>
        )}
      </div>

      <div className="dashboard-ctas" style={{ marginTop: '12px' }}>
        {isGymEnabled && (
          <Link href="/gym" className="cta-card cta-blue">
            <span className="cta-icon-wrapper">
              <Dumbbell size={22} />
            </span>
            <div>
              <div className="cta-title">Log Today&apos;s Gym</div>
              <div className="cta-sub">Did you hit the gym today?</div>
            </div>
            <span className="cta-arrow">
              <ArrowRight size={18} />
            </span>
          </Link>
        )}
        {isSmokeEnabled && (
          <Link href="/smoke" className="cta-card cta-green">
            <span className="cta-icon-wrapper">
              <CigaretteOff size={22} />
            </span>
            <div>
              <div className="cta-title">Quit Smoking Dashboard</div>
              <div className="cta-sub">Track milestones & log cravings</div>
            </div>
            <span className="cta-arrow">
              <ArrowRight size={18} />
            </span>
          </Link>
        )}
        {isAlcoholEnabled && (
          <Link href="/alcohol" className="cta-card cta-orange">
            <span className="cta-icon-wrapper">
              <Beer size={22} />
            </span>
            <div>
              <div className="cta-title">Quit Alcohol Dashboard</div>
              <div className="cta-sub">Monitor milestones & alcohol logs</div>
            </div>
            <span className="cta-arrow">
              <ArrowRight size={18} />
            </span>
          </Link>
        )}
        {isCoachEnabled && (
          <Link href="/coach" className="cta-card cta-purple">
            <span className="cta-icon-wrapper">
              <Bot size={22} />
            </span>
            <div>
              <div className="cta-title">AI Sobriety Coach</div>
              <div className="cta-sub">Get fitness & craving advice</div>
            </div>
            <span className="cta-arrow">
              <ArrowRight size={18} />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}


