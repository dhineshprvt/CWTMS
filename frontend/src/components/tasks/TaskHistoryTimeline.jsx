import { formatDateTime } from '../../utils/dateFormat';
import StatusBadge from '../common/StatusBadge';

export default function TaskHistoryTimeline({ history }) {
  if (!history || history.length === 0) {
    return <p className="text-muted">No history yet.</p>;
  }
  return (
    <ul className="list-unstyled">
      {history.map((h) => (
        <li key={h.id} className="mb-3 border-bottom pb-2">
          <div className="d-flex align-items-center gap-2">
            <StatusBadge status={h.newStatus} />
            <span className="text-muted small">{formatDateTime(h.changedAt)}</span>
          </div>
          <div className="small mt-1">By {h.changedByName}</div>
          {h.remarks && <div className="small text-muted mt-1">"{h.remarks}"</div>}
        </li>
      ))}
    </ul>
  );
}
