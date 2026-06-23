import { CATEGORY_LABELS } from '../../utils/statusColors';

const STATUS_OPTIONS = [
  'ASSIGNED', 'IN_PROGRESS', 'SUBMITTED_FOR_REVIEW', 'APPROVED', 'REJECTED', 'REWORK_REQUIRED',
];

export default function SearchFilterBar({ filters, onChange }) {
  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="d-flex gap-2 mb-3 flex-wrap">
      <input
        className="form-control"
        style={{ maxWidth: 240 }}
        placeholder="Search by title..."
        value={filters.keyword || ''}
        onChange={(e) => update('keyword', e.target.value)}
      />

      <select
        className="form-select"
        style={{ maxWidth: 200 }}
        value={filters.status || ''}
        onChange={(e) => update('status', e.target.value)}
      >
        <option value="">All Statuses</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>
        ))}
      </select>

      <select
        className="form-select"
        style={{ maxWidth: 220 }}
        value={filters.category || ''}
        onChange={(e) => update('category', e.target.value)}
      >
        <option value="">All Categories</option>
        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
          <option key={key} value={key}>{label}</option>
        ))}
      </select>
    </div>
  );
}
