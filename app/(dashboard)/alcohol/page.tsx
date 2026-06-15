'use client';
import { useState } from 'react';
import { useAlcohol } from '@/lib/hooks/useAlcohol';
import { saveAlcoholSettings } from '@/lib/firestore/alcohol';
import { useAuth } from '@/lib/hooks/useAuth';
import { AlcoholCounter } from '@/components/alcohol/AlcoholCounter';
import { AlcoholMilestonesPanel } from '@/components/alcohol/AlcoholMilestonesPanel';
import { AlcoholCravingLog } from '@/components/alcohol/AlcoholCravingLog';
import { StatCard } from '@/components/shared/StatCard';
import { Timestamp } from 'firebase/firestore';
import { Beer, Settings, Coins, Shield, Sparkles } from 'lucide-react';

const ALCOHOL_TIPS = [
  "The Carbonation trick: Drink a large glass of sparkling water with fresh lemon or lime. The fizz and bite mimic the sensory feel of a drink.",
  "Distraction Stretch: Stretch your neck, back, and shoulders for 3 minutes. Alcohol cravings are often masked tension; physical release works wonders.",
  "Play the Tape Forward: Visualize the morning after. Remember the headache, regret, and low energy. Compare it to waking up fresh and sober.",
  "Box Breathing (4-4-4-4): Calm social or evening stress by breathing. 3 minutes of deep box breathing lowers blood pressure and replaces the urge to drink.",
  "Environment Reset: If you are at home or a bar where cravings spike, immediately change rooms or step outside for 5 minutes of fresh air."
];

export default function AlcoholPage() {
  const { user, profile, updateProfileData } = useAuth();
  const { quitDate, settings, cravings, moneySaved, drinksSaved, refresh } = useAlcohol();
  const [showSettings, setShowSettings] = useState(false);
  const [drinksPerWeek, setDrinksPerWeek] = useState(10);
  const [costPerDrink, setCostPerDrink] = useState(7);
  const [quitDateStr, setQuitDateStr] = useState(() => new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  const [alcoholTip] = useState(() => {
    if (typeof window !== 'undefined') {
      const idx = new Date().getDate() % ALCOHOL_TIPS.length;
      return ALCOHOL_TIPS[idx];
    }
    return ALCOHOL_TIPS[0];
  });

  const openSettings = () => {
    setDrinksPerWeek(settings?.drinksPerWeek ?? 10);
    setCostPerDrink(settings?.costPerDrink ?? 7);
    if (quitDate) {
      setQuitDateStr(quitDate.toISOString().split('T')[0]);
    } else {
      setQuitDateStr(new Date().toISOString().split('T')[0]);
    }
    setShowSettings(true);
  };

  const handleSaveSettings = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await Promise.all([
        saveAlcoholSettings(user.uid, { drinksPerWeek, costPerDrink }),
        updateProfileData({
          alcoholQuitDate: Timestamp.fromDate(new Date(quitDateStr)),
        }),
      ]);
      setShowSettings(false);
      refresh();
    } catch (err) {
      console.error('Failed to save alcohol settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const cravingsResisted = cravings.filter((c) => c.resisted).length;
  const currency = profile?.currency ?? '$';

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Beer size={32} className="text-orange" style={{ color: 'var(--orange)' }} />
            <h1 className="page-title">Quit Alcohol</h1>
          </div>
          <p className="page-sub" style={{ marginTop: '4px' }}>Reclaiming your health and clarity, one day at a time.</p>
        </div>
        <button className="btn-secondary" onClick={openSettings} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Settings size={16} />
          <span>Settings</span>
        </button>
      </div>

      {/* Dynamic Remedy & Motivation Card */}
      <div className="glass-card" style={{ borderLeft: '3px solid var(--orange)', background: 'rgba(249, 115, 22, 0.02)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--orange)', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Sparkles size={16} />
          <span>Motivation & Sobriety Remedy of the Day</span>
        </h3>
        <p style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
          {alcoholTip}
        </p>
      </div>

      {quitDate ? (
        <div className="glass-card smoke-hero" style={{ borderLeft: '3px solid var(--orange)' }}>
          <AlcoholCounter quitDate={quitDate} />
        </div>
      ) : (
        <div className="glass-card empty-state">
          <p>You haven&apos;t set up your alcohol quit date yet.</p>
          <button className="btn-primary" style={{ marginTop: '12px', background: 'linear-gradient(135deg, var(--orange), #f97316)', boxShadow: '0 4px 15px rgba(249,115,22,0.3)' }} onClick={openSettings}>
            Set Up Now
          </button>
        </div>
      )}

      {quitDate && (
        <>
          <div className="stats-grid stats-grid-3">
            <StatCard label="Money Saved" value={`${currency}${moneySaved.toFixed(2)}`} icon={<Coins size={20} />} accent="orange" />
            <StatCard label="Drinks Saved" value={`${drinksSaved.toFixed(1)} drinks`} icon={<Beer size={20} />} accent="orange" />
            <StatCard label="Craving Resistance" value={`${cravingsResisted}/${cravings.length}`} icon={<Shield size={20} />} accent="green" />
          </div>

          <div className="two-col">
            <div className="glass-card">
              <AlcoholMilestonesPanel quitDate={quitDate} />
            </div>
            <div className="glass-card">
              <AlcoholCravingLog cravings={cravings} onSaved={refresh} />
            </div>
          </div>
        </>
      )}

      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={20} />
                <h2 style={{ fontSize: '18px', fontWeight: 700 }}>Alcohol Settings</h2>
              </div>
              <button className="modal-close" onClick={() => setShowSettings(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label className="field-label">
                Quit Date
                <input type="date" className="field-input" value={quitDateStr}
                  onChange={(e) => setQuitDateStr(e.target.value)} />
              </label>
              <label className="field-label">
                Drinks per week (before quitting)
                <input type="number" className="field-input" value={drinksPerWeek}
                  onChange={(e) => setDrinksPerWeek(Number(e.target.value))} min={1} />
              </label>
              <label className="field-label">
                Average cost per drink ({currency})
                <input type="number" className="field-input" value={costPerDrink}
                  onChange={(e) => setCostPerDrink(Number(e.target.value))} min={0} step={0.01} />
              </label>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowSettings(false)}>Cancel</button>
              <button className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--orange), #f97316)' }} onClick={handleSaveSettings} disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

