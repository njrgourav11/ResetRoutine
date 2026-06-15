'use client';
import { useEffect, useState } from 'react';

interface AlcoholCounterProps {
  quitDate: Date;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function AlcoholCounter({ quitDate }: AlcoholCounterProps) {
  const [elapsed, setElapsed] = useState(() => Date.now() - quitDate.getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - quitDate.getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, [quitDate]);

  const totalSec = Math.floor(elapsed / 1000);
  const seconds = totalSec % 60;
  const minutes = Math.floor(totalSec / 60) % 60;
  const hours = Math.floor(totalSec / 3600) % 24;
  const days = Math.floor(totalSec / 86400);

  return (
    <div className="smoke-counter">
      <div className="counter-label" style={{ color: 'var(--text-secondary)' }}>Sober For</div>
      <div className="counter-digits">
        <div className="counter-unit">
          <span className="counter-num" style={{ background: 'linear-gradient(135deg, var(--orange), #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{days}</span>
          <span className="counter-unit-label">Days</span>
        </div>
        <span className="counter-sep">:</span>
        <div className="counter-unit">
          <span className="counter-num" style={{ background: 'linear-gradient(135deg, var(--orange), #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{pad(hours)}</span>
          <span className="counter-unit-label">Hours</span>
        </div>
        <span className="counter-sep">:</span>
        <div className="counter-unit">
          <span className="counter-num" style={{ background: 'linear-gradient(135deg, var(--orange), #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{pad(minutes)}</span>
          <span className="counter-unit-label">Mins</span>
        </div>
        <span className="counter-sep">:</span>
        <div className="counter-unit">
          <span className="counter-num" style={{ background: 'linear-gradient(135deg, var(--orange), #fb923c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{pad(seconds)}</span>
          <span className="counter-unit-label">Secs</span>
        </div>
      </div>
    </div>
  );
}
