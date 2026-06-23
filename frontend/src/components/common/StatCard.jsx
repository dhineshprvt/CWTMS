export default function StatCard({ label, value, color = '#2563eb' }) {
  return (
    <div className="stat-card">
      <div className="text-muted small mb-1">{label}</div>
      <div className="stat-value" style={{ color }}>{value}</div>
    </div>
  );
}
