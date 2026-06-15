'use client';
import { useState, useEffect } from 'react';
import { Heart, Wind, Zap, Shield, Activity, Sprout, Trophy, Sparkles, Check } from 'lucide-react';

const MILESTONES = [
  { hours: 0.33, label: '20 Minutes', desc: 'Heart rate & blood pressure drop', Icon: Heart },
  { hours: 12, label: '12 Hours', desc: 'Carbon monoxide levels normalize', Icon: Wind },
  { hours: 48, label: '2 Days', desc: 'Nerve endings start to regrow', Icon: Zap },
  { hours: 72, label: '3 Days', desc: 'Nicotine fully cleared from body', Icon: Shield },
  { hours: 336, label: '2 Weeks', desc: 'Circulation & lung function improve', Icon: Activity },
  { hours: 720, label: '1 Month', desc: 'Coughing & shortness of breath decrease', Icon: Wind },
  { hours: 2160, label: '3 Months', desc: 'Cilia regrow in lungs', Icon: Sprout },
  { hours: 8760, label: '1 Year', desc: 'Heart disease risk cut in half', Icon: Trophy },
  { hours: 43800, label: '5 Years', desc: 'Stroke risk same as non-smoker', Icon: Sparkles },
];

interface MilestonesPanelProps {
  quitDate: Date;
}

export function MilestonesPanel({ quitDate }: MilestonesPanelProps) {
  const [hoursElapsed, setHoursElapsed] = useState(() => (Date.now() - quitDate.getTime()) / (1000 * 60 * 60));

  useEffect(() => {
    Promise.resolve().then(() => {
      setHoursElapsed((Date.now() - quitDate.getTime()) / (1000 * 60 * 60));
    });
  }, [quitDate]);

  return (
    <div className="milestones-panel">
      <h3 className="section-title">Health Milestones</h3>
      <div className="milestones-list">
        {MILESTONES.map((m) => {
          const achieved = hoursElapsed >= m.hours;
          return (
            <div key={m.label} className={`milestone-item ${achieved ? 'achieved' : 'pending'}`}>
              <span className="milestone-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: achieved ? 'var(--green)' : 'var(--text-muted)' }}>
                <m.Icon size={18} />
              </span>
              <div className="milestone-info">
                <span className="milestone-label">{m.label}</span>
                <span className="milestone-desc">{m.desc}</span>
              </div>
              {achieved && (
                <span className="milestone-check" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--green)' }}>
                  <Check size={16} />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

