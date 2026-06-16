'use client';
import { useState } from 'react';
import { logAlcoholCraving, AlcoholCraving } from '@/lib/firestore/alcohol';
import { useAuth } from '@/lib/hooks/useAuth';
import { Check, Beer, Sparkles } from 'lucide-react';

const TRIGGERS = ['Stress', 'Boredom', 'Social Setting', 'After Work', 'Dinner', 'Anxiety', 'Celebrating', 'Other'];

interface AlcoholCravingLogProps {
  cravings: AlcoholCraving[];
  onSaved: () => void;
}

export function AlcoholCravingLog({ cravings, onSaved }: AlcoholCravingLogProps) {
  const { user } = useAuth();
  const [show, setShow] = useState(false);
  const [intensity, setIntensity] = useState(5);
  const [trigger, setTrigger] = useState('Stress');
  const [resisted, setResisted] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showRemedy, setShowRemedy] = useState(false);
  const [remedyTitle, setRemedyTitle] = useState('');
  const [remedyDesc, setRemedyDesc] = useState('');

  const handleLog = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await logAlcoholCraving(user.uid, { intensity, trigger, resisted });

      onSaved();
      setShow(false);

      if (resisted) {
        setRemedyTitle("Victory! You Resisted!");
        setRemedyDesc("Superb resolve! Every successfully resisted craving weakens the neurological hold of alcohol and builds deep physical resilience.");
      } else {
        setRemedyTitle("Reset and Restart");
        setRemedyDesc("Be kind to yourself. Sobriety is a path of consistency, not perfection. Re-anchor yourself right now and get through the day.");
      }

      let tip = "";
      if (trigger === 'Stress' || trigger === 'Anxiety' || trigger === 'After Work') {
        tip = "💡 Remedy (Nervous Reset): Sip a large sparkling water with fresh lemon or lime. Box breathe: Inhale 4s, hold 4s, exhale 4s, hold empty 4s to regulate pressure.";
      } else if (trigger === 'Dinner' || trigger === 'Celebrating') {
        tip = "💡 Remedy (Drink Swap): Mix ginger beer with lime juice or grab a mocktail. Keep a glass in hand to satisfy the social/habitual holding gesture.";
      } else if (trigger === 'Social Setting') {
        tip = "💡 Remedy (10-Minute Delay): Move to a different space or step outside for fresh air. Distract your mind by talking to someone or checking your stats.";
      } else {
        tip = "💡 Remedy (Physical Shift): Do a quick 2-minute stretch or do 15 jumping jacks to flood your system with clean endorphins and shake off the urge.";
      }

      setRemedyDesc((prev) => `${prev}\n\n${tip}`);
      setShowRemedy(true);
    } catch (err) {
      console.error('Failed to log alcohol craving:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="craving-section">
      {showRemedy && (
        <div className="modal-overlay" onClick={() => setShowRemedy(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ borderLeft: '4px solid var(--orange)' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--orange)' }}>
                <Sparkles size={20} />
                <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{remedyTitle}</h2>
              </div>
              <button className="modal-close" onClick={() => setShowRemedy(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              {remedyDesc.split('\n\n').map((para, i) => (
                <p key={i} style={{ marginBottom: '12px' }}>{para}</p>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--orange), #f97316)' }} onClick={() => setShowRemedy(false)}>Got It, Stay Strong</button>
            </div>
          </div>
        </div>
      )}
      <div className="section-header">
        <h3 className="section-title">Alcohol Craving Log</h3>
        <button className="btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, var(--orange), #f97316)', boxShadow: '0 4px 15px rgba(249,115,22,0.3)' }} onClick={() => setShow(true)}>
          + Log Craving
        </button>
      </div>

      {show && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Log an Alcohol Craving</h2>
              <button className="modal-close" onClick={() => setShow(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label className="field-label">
                Intensity: {intensity}/10
                <input
                  type="range" min={1} max={10} value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="range-input"
                  style={{ accentColor: 'var(--orange)' }}
                />
              </label>
              <label className="field-label">
                Trigger
                <div className="trigger-grid">
                  {TRIGGERS.map((t) => (
                     <button
                       key={t}
                       className={`trigger-chip ${trigger === t ? 'active' : ''}`}
                       onClick={() => setTrigger(t)}
                       style={trigger === t ? { background: 'var(--orange-dim)', borderColor: 'var(--orange)', color: 'var(--orange)' } : {}}
                     >{t}</button>
                  ))}
                </div>
              </label>
              <div className="toggle-group">
                <button
                  className={`toggle-btn ${resisted ? 'active-green' : ''}`}
                  onClick={() => setResisted(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
                >
                  <Check size={16} />
                  <span>Resisted</span>
                </button>
                <button
                  className={`toggle-btn ${!resisted ? 'active-red' : ''}`}
                  onClick={() => setResisted(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
                >
                  <Beer size={16} />
                  <span>Gave In</span>
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShow(false)}>Cancel</button>
              <button className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--orange), #f97316)' }} onClick={handleLog} disabled={saving}>
                {saving ? 'Saving...' : 'Log It'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="craving-list">
        {cravings.slice(0, 10).map((c) => (
          <div key={c.id} className={`craving-item ${c.resisted ? 'resisted' : 'gave-in'}`}
               style={c.resisted ? { background: 'var(--green-dim)', borderColor: 'rgba(16,185,129,0.2)' } : { background: 'var(--red-dim)', borderColor: 'rgba(239,68,68,0.2)' }}>
            <span className="craving-badge" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: c.resisted ? 'var(--green)' : 'var(--red)' }}>
              {c.resisted ? <Check size={16} /> : <Beer size={16} />}
            </span>
            <span className="craving-trigger">{c.trigger}</span>
            <span className="craving-intensity">{c.intensity}/10</span>
            <span className="craving-time">
              {c.timestamp?.toDate?.()?.toLocaleDateString() ?? ''}
            </span>
          </div>
        ))}
        {cravings.length === 0 && (
          <p className="empty-state">No cravings logged yet. Keep up the great work!</p>
        )}
      </div>
    </div>
  );
}

