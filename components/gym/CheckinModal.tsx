'use client';
import { useState } from 'react';
import { logGymDay, updateCheckin, GymCheckin } from '@/lib/firestore/gym';
import { useAuth } from '@/lib/hooks/useAuth';
import { Check, X } from 'lucide-react';

interface CheckinModalProps {
  date: string;
  existing?: GymCheckin | null;
  onClose: () => void;
  onSaved: () => void;
}

export function CheckinModal({ date, existing, onClose, onSaved }: CheckinModalProps) {
  const { user } = useAuth();
  const [wentToGym, setWentToGym] = useState(existing?.wentToGym ?? true);
  const [notes, setNotes] = useState(existing?.notes ?? '');
  const [exercises, setExercises] = useState(existing?.exercises?.join(', ') ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const exList = exercises.split(',').map((e) => e.trim()).filter(Boolean);
    if (existing?.id) {
      await updateCheckin(user.uid, existing.id, { wentToGym, notes, exercises: exList });
    } else {
      await logGymDay(user.uid, { date, wentToGym, notes, exercises: exList });
    }
    setSaving(false);
    onSaved();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Log {date}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="toggle-group">
            <button
              className={`toggle-btn ${wentToGym ? 'active-green' : ''}`}
              onClick={() => setWentToGym(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
            >
              <Check size={16} />
              <span>Went to Gym</span>
            </button>
            <button
              className={`toggle-btn ${!wentToGym ? 'active-red' : ''}`}
              onClick={() => setWentToGym(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}
            >
              <X size={16} />
              <span>Rest Day</span>
            </button>
          </div>

          {wentToGym && (
            <>
              <label className="field-label">
                Exercises (comma separated)
                <input
                  className="field-input"
                  value={exercises}
                  onChange={(e) => setExercises(e.target.value)}
                  placeholder="Bench Press, Squats, Deadlifts..."
                />
              </label>
              <label className="field-label">
                Session Notes
                <textarea
                  className="field-input field-textarea"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did it go? PRs, feelings, etc."
                />
              </label>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

