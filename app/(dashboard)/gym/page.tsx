'use client';
import { useState } from 'react';
import { useWorkouts } from '@/lib/hooks/useWorkouts';
import { getCheckinByDate, GymCheckin } from '@/lib/firestore/gym';
import { HeatmapCalendar } from '@/components/gym/HeatmapCalendar';
import { CheckinModal } from '@/components/gym/CheckinModal';
import { StatCard } from '@/components/shared/StatCard';
import { useAuth } from '@/lib/hooks/useAuth';
import { Dumbbell, Flame, Calendar, Check, Moon } from 'lucide-react';

export default function GymPage() {
  const { user } = useAuth();
  const { checkins, gymDates, currentStreak, loading, refresh } = useWorkouts();
  const [modalDate, setModalDate] = useState<string | null>(null);
  const [existing, setExisting] = useState<GymCheckin | null>(null);

  const today = new Date().toISOString().split('T')[0];

  const openModal = async (date: string) => {
    if (!user) return;
    const ex = await getCheckinByDate(user.uid, date);
    setExisting(ex);
    setModalDate(date);
  };

  const gymThisMonth = checkins.filter((c) => {
    const d = new Date(c.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && c.wentToGym;
  }).length;

  const totalSessions = checkins.filter((c) => c.wentToGym).length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Dumbbell size={32} className="text-blue" style={{ color: 'var(--blue)' }} />
            <h1 className="page-title">Gym Tracker</h1>
          </div>
          <p className="page-sub" style={{ marginTop: '4px' }}>Log your daily gym attendance and track your consistency.</p>
        </div>
        <button className="btn-primary" onClick={() => openModal(today)}>
          + Log Today
        </button>
      </div>

      <div className="stats-grid stats-grid-3">
        <StatCard label="Current Streak" value={`${currentStreak} days`} icon={<Flame size={20} />} accent="blue" />
        <StatCard label="This Month" value={`${gymThisMonth} sessions`} icon={<Calendar size={20} />} accent="blue" />
        <StatCard label="Total Sessions" value={totalSessions} icon={<Dumbbell size={20} />} accent="purple" />
      </div>

      <div className="glass-card">
        <h3 className="section-title">Activity Heatmap (Last 52 weeks)</h3>
        <HeatmapCalendar gymDates={gymDates} />
      </div>

      <div className="glass-card">
        <h3 className="section-title">Recent Sessions</h3>
        <div className="session-list">
          {checkins.slice(0, 20).map((c) => (
            <div
              key={c.id}
              className={`session-item ${c.wentToGym ? 'went' : 'rest'}`}
              onClick={() => openModal(c.date)}
            >
              <span className="session-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: c.wentToGym ? 'var(--blue)' : 'var(--text-muted)' }}>
                {c.wentToGym ? <Dumbbell size={18} /> : <Moon size={18} />}
              </span>
              <div className="session-info">
                <span className="session-date">{c.date}</span>
                {c.exercises?.length > 0 && (
                  <span className="session-exercises">{c.exercises.join(' • ')}</span>
                )}
                {c.notes && <span className="session-notes">{c.notes}</span>}
              </div>
              <span className="session-edit">Edit</span>
            </div>
          ))}
          {checkins.length === 0 && !loading && (
            <p className="empty-state">No sessions logged yet. Start by logging today!</p>
          )}
        </div>
      </div>

      {modalDate && (
        <CheckinModal
          date={modalDate}
          existing={existing}
          onClose={() => { setModalDate(null); setExisting(null); }}
          onSaved={refresh}
        />
      )}
    </div>
  );
}

