export default function StatCard({ label, value, tone = 'neutral' }) {
  return (
    <div className={`stat stat--${tone}`}>
      <p className="stat__value">{value}</p>
      <p className="stat__label">{label}</p>
    </div>
  );
}
