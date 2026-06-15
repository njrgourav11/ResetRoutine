'use client';
import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: 'blue' | 'green' | 'orange' | 'purple';
  icon?: React.ReactNode;
}

export function StatCard({ label, value, sub, accent = 'blue', icon }: StatCardProps) {
  return (
    <div className={`stat-card accent-${accent}`}>
      {icon && <span className="stat-icon-wrapper">{icon}</span>}
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  );
}
