'use client';
import { useState, useEffect } from 'react';
import { Shield, Droplet, Brain, Moon, Sparkles, Zap, Heart, Trophy, Check } from 'lucide-react';

const MILESTONES = [
  { hours: 1, label: '1 Hour', desc: 'Liver starts clearing alcohol from bloodstream', Icon: Shield },
  { hours: 12, label: '12 Hours', desc: 'Blood sugar levels normalize, dehydration reduces', Icon: Droplet },
  { hours: 24, label: '24 Hours', desc: 'Hangover symptoms subside, anxiety levels decrease', Icon: Brain },
  { hours: 72, label: '3 Days', desc: 'REM sleep improves, body starts to fully detoxify', Icon: Moon },
  { hours: 168, label: '1 Week', desc: 'Sleep patterns normalize, skin hydration improves', Icon: Sparkles },
  { hours: 336, label: '2 Weeks', desc: 'Brain fog clears, reflux symptoms decrease', Icon: Brain },
  { hours: 720, label: '1 Month', desc: 'Liver fat reduces up to 15%, energy levels increase', Icon: Zap },
  { hours: 2160, label: '3 Months', desc: 'Risk of cardiovascular disease drops, blood pressure improves', Icon: Heart },
  { hours: 8760, label: '1 Year', desc: 'Liver damage begins to reverse significantly', Icon: Trophy },
];

interface AlcoholMilestonesPanelProps {
  quitDate: Date;
}

export function AlcoholMilestonesPanel({ quitDate }: AlcoholMilestonesPanelProps) {
  const [hoursElapsed, setHoursElapsed] = useState(() => (Date.now() - quitDate.getTime()) / (1000 * 60 * 60));

  useEffect(() => {
    Promise.resolve().then(() => {
      setHoursElapsed((Date.now() - quitDate.getTime()) / (1000 * 60 * 60));
    });
  }, [quitDate]);

  return (
    <div className="milestones-panel">
      <h3 className="section-title">Detox Milestones</h3>
      <div className="milestones-list">
        {MILESTONES.map((m) => {
          const achieved = hoursElapsed >= m.hours;
          return (
            <div key={m.label} className={`milestone-item ${achieved ? 'achieved' : 'pending'}`}
                 style={achieved ? { background: 'var(--orange-dim)', borderColor: 'rgba(249,115,22,0.3)' } : {}}>
              <span className="milestone-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: achieved ? 'var(--orange)' : 'var(--text-muted)' }}>
                <m.Icon size={18} />
              </span>
              <div className="milestone-info">
                <span className="milestone-label">{m.label}</span>
                <span className="milestone-desc">{m.desc}</span>
              </div>
              {achieved && (
                <span className="milestone-check" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--orange)' }}>
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

