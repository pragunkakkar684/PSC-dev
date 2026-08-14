interface StatCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  sub?: string;
}

export function StatCard({ label, value, icon, sub }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-label">{label}</span>
        {icon && <span className="stat-card-icon">{icon}</span>}
      </div>
      <div className="stat-card-value">{value}</div>
      {sub && <div className="stat-card-sub">{sub}</div>}
    </div>
  );
}
