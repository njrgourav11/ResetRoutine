'use client';
import { useState } from 'react';
import { logCraving, Craving } from '@/lib/firestore/smoke';
import { useAuth } from '@/lib/hooks/useAuth';
import { Check, Cigarette, Sparkles } from 'lucide-react';

const TRIGGERS = ['Stress', 'Boredom', 'After eating', 'Social', 'Morning', 'Alcohol', 'Other'];

interface CravingLogProps {
  cravings: Craving[];
  onSaved: () => void;
}

export function CravingLog({ cravings, onSaved }: CravingLogProps) {
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
      await logCraving(user.uid, { intensity, trigger, resisted });
      onSaved();
      setShow(false);

      if (resisted) {
        setRemedyTitle("Victory! You Resisted!");
        setRemedyDesc("Brilliant discipline! Every time you resist, you weaken the physical craving pathways in your brain.");
      } else {
        setRemedyTitle("Reset and Focus");
        setRemedyDesc("Slip-ups are part of recovery. Reset your intention right now. Focus only on getting through the next hour.");
      }

      let tip = "";
      if (trigger === 'Stress' || trigger === 'Morning') {
        tip = "💡 Remedy (Box Breathing): Inhale slowly for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold empty for 4 seconds. Repeat this 3 times to ground your nervous system.";
      } else if (trigger === 'Boredom' || trigger === 'After eating') {
        tip = "💡 Remedy (Tactile Shift): Chew some strong mint gum, drink a tall glass of ice water, or splash cold water on your face to break the sensory cue.";
      } else if (trigger === 'Social' || trigger === 'Alcohol') {
        tip = "💡 Remedy (10-Minute Delay): Cravings typically peak within 5 minutes. Tell yourself you will wait 10 minutes, step outside for fresh air, and sip water.";
      } else {
        tip = "💡 Remedy (Physical Burst): Do 10 bodyweight squats or stretch your shoulders. A quick burst of physical movement releases endorphins to override cravings.";
      }

      setRemedyDesc((prev) => `${prev}\n\n${tip}`);
      setShowRemedy(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="craving-section">
      {showRemedy && (
        <div className="modal-overlay" onClick={() => setShowRemedy(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ borderLeft: '4px solid var(--green)' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--green)' }}>
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
              <button className="btn-primary" onClick={() => setShowRemedy(false)}>Got It, Stay Strong</button>
            </div>
          </div>
        </div>
      )}
      <div className="section-header">
        <h3 className="section-title">Craving Log</h3>
        <button className="btn-primary btn-sm" onClick={() => setShow(true)}>+ Log Craving</button>
      </div>

      {show && (
        <div className="modal-overlay" onClick={() => setShow(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Log a Craving</h2>
              <button className="modal-close" onClick={() => setShow(false)}>✕</button>
            </div>
            <div className="modal-body">
              <label className="field-label">
                Intensity: {intensity}/10
                <input
                  type="range" min={1} max={10} value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="range-input"
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
                  <Cigarette size={16} />
                  <span>Gave In</span>
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShow(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleLog} disabled={saving}>
                {saving ? 'Saving...' : 'Log It'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="craving-list">
        {cravings.slice(0, 10).map((c) => (
          <div key={c.id} className={`craving-item ${c.resisted ? 'resisted' : 'gave-in'}`}>
            <span className="craving-badge" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: c.resisted ? 'var(--green)' : 'var(--red)' }}>
              {c.resisted ? <Check size={16} /> : <Cigarette size={16} />}
            </span>
            <span className="craving-trigger">{c.trigger}</span>
            <span className="craving-intensity">{c.intensity}/10</span>
            <span className="craving-time">
              {c.timestamp?.toDate?.()?.toLocaleDateString() ?? ''}
            </span>
          </div>
        ))}
        {cravings.length === 0 && (
          <p className="empty-state">No cravings logged yet. You&apos;re crushing it!</p>
        )}
      </div>
    </div>
  );
}

