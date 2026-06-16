'use client';
import { useState } from 'react';
import { useSmoke } from '@/lib/hooks/useSmoke';
import { saveSmokeSettings } from '@/lib/firestore/smoke';
import { useAuth } from '@/lib/hooks/useAuth';
import { SmokeCounter } from '@/components/smoke/SmokeCounter';
import { MilestonesPanel } from '@/components/smoke/MilestonesPanel';
import { CravingLog } from '@/components/smoke/CravingLog';
import { StatCard } from '@/components/shared/StatCard';
import { CigaretteOff, Settings, Coins, Shield, Heart, Sparkles } from 'lucide-react';

const SMOKE_TIPS = [
  "Box Breathing (4-4-4-4): Inhale slowly for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold empty for 4 seconds. This regulates stress hormones and helps bypass strong urges.",
  "Mammalian Dive Reflex: Splash freezing cold water on your face. This instantly lowers your heart rate and resets your nervous system, breaking the craving cycle.",
  "The 10-Minute Rule: Delay action by 10 minutes. A typical craving peaks around 3-5 minutes and then subsides. Distract yourself, and the urge will pass.",
  "Oral Fixation alternative: Keep sugar-free gum, mints, or crunchy snacks like celery or carrots handy to occupy your mouth when a craving strikes.",
  "Physical Burst: Drop and do 10 push-ups, squats, or jumping jacks. The physical burst burns off stress and releases natural feel-good endorphins."
];

export default function SmokePage() {
  const { user, profile } = useAuth();
  const { quitDate, streakStartDate, settings, cravings, moneySaved, refresh } = useSmoke();
  const [showSettings, setShowSettings] = useState(false);
  const [cigsPerDay, setCigsPerDay] = useState(20);
  const [costPerCigarette, setCostPerCigarette] = useState(0.60);
  const [saving, setSaving] = useState(false);

  const [smokeTip] = useState(() => {
    if (typeof window !== 'undefined') {
      const idx = new Date().getDate() % SMOKE_TIPS.length;
      return SMOKE_TIPS[idx];
    }
    return SMOKE_TIPS[0];
  });

  const openSettings = () => {
    // Sync local state from loaded settings before showing modal
    setCigsPerDay(settings?.cigsPerDay ?? 20);
    setCostPerCigarette(settings?.costPerCigarette ?? 0.60);
    setShowSettings(true);
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    setSaving(true);
    await saveSmokeSettings(user.uid, {
      cigsPerDay,
      costPerCigarette,
      costPerPack: costPerCigarette * 20,
      cigsPerPack: 20,
    });
    setSaving(false);
    setShowSettings(false);
    refresh();
  };

  const cravingsResisted = cravings.filter((c) => c.resisted).length;
  const resistanceRate = cravings.length > 0
    ? Math.round((cravingsResisted / cravings.length) * 100)
    : 100;

  const currency = profile?.currency ?? '$';

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CigaretteOff size={32} className="text-green" style={{ color: 'var(--green)' }} />
            <h1 className="page-title">Quit Smoking</h1>
          </div>
          <p className="page-sub" style={{ marginTop: '4px' }}>Every second counts. You&apos;re doing amazing.</p>
        </div>
        <button className="btn-secondary" onClick={openSettings} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>

      {/* Dynamic Remedy & Motivation Card */}
      <div className="glass-card" style={{ borderLeft: '3px solid var(--green)', background: 'rgba(16, 185, 129, 0.02)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Sparkles size={16} />
          <span>Motivation & Craving Remedy of the Day</span>
        </h3>
        <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
          {smokeTip}
        </p>
      </div>

      {streakStartDate && (
        <div className="glass-card smoke-hero">
          <SmokeCounter quitDate={streakStartDate} />
        </div>
      )}

      <div className="stats-grid stats-grid-3">
        <StatCard label="Money Saved" value={`${currency}${moneySaved.toFixed(2)}`} icon={<Coins size={20} />} accent="green" />
        <StatCard label="Cravings Resisted" value={`${cravingsResisted}/${cravings.length}`} icon={<Shield size={20} />} accent="green" />
        <StatCard label="Resistance Rate" value={`${resistanceRate}%`} icon={<Heart size={20} />} accent="orange" />
      </div>

      <div className="two-col">
        <div className="glass-card">
          {streakStartDate && <MilestonesPanel quitDate={streakStartDate} />}
        </div>
        <div className="glass-card">
          <CravingLog cravings={cravings} onSaved={refresh} />
        </div>
      </div>

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={20} />
                <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Smoking Settings</h2>
              </div>
              <button className="modal-close" onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label className="field-label">
                Cigarettes smoked per day
                <input type="number" className="field-input" value={cigsPerDay}
                  onChange={(e) => setCigsPerDay(Number(e.target.value))} min={1} />
              </label>
              <label className="field-label">
                Price per single Cigarette ({currency})
                <input type="number" className="field-input" value={costPerCigarette}
                  onChange={(e) => setCostPerCigarette(Number(e.target.value))} min={0} step={0.01} />
              </label>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowSettings(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveSettings} disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

