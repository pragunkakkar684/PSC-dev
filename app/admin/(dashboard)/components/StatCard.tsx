interface StatCardProps {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  sub?: string;
}

export function StatCard({ label, value, icon, sub }: StatCardProps) {
  return (
    <div className="stat-card">
      {icon && <div className="stat-icon">{icon}</div>}
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-detail">{sub}</div>}
    </div>
  );
}
