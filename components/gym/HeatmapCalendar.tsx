'use client';

interface HeatmapCalendarProps {
  gymDates: Set<string>;
}

export function HeatmapCalendar({ gymDates }: HeatmapCalendarProps) {
  const today = new Date();
  const cells: { date: string; active: boolean }[] = [];

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    cells.push({ date: dateStr, active: gymDates.has(dateStr) });
  }

  // Split into weeks (columns)
  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="heatmap-wrapper">
      <div className="heatmap-grid">
        {weeks.map((week, wi) => (
          <div key={wi} className="heatmap-week">
            {week.map((cell) => (
              <div
                key={cell.date}
                className={`heatmap-cell ${cell.active ? 'active' : ''}`}
                title={cell.date}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="heatmap-legend">
        <span>Less</span>
        <div className="heatmap-cell" />
        <div className="heatmap-cell active" />
        <span>More</span>
      </div>
    </div>
  );
}
