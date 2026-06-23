import { useState, useEffect } from 'react';
import { STATUS_COLORS } from '../../utils/statusColors';
import { translate } from '../../utils/translations';

const STATUS_EMOJIS = {
  ASSIGNED: '📋',
  IN_PROGRESS: '🏃',
  SUBMITTED_FOR_REVIEW: '📤',
  APPROVED: '✅',
  REJECTED: '❌',
  REWORK_REQUIRED: '⚠️',
};

export default function StatusBadge({ status }) {
  const [lang, setLang] = useState(localStorage.getItem('cwtms_lang') || 'en');

  useEffect(() => {
    const handler = () => {
      setLang(localStorage.getItem('cwtms_lang') || 'en');
    };
    window.addEventListener('cwtms_lang_change', handler);
    return () => window.removeEventListener('cwtms_lang_change', handler);
  }, []);

  const color = STATUS_COLORS[status] || '#6c757d';
  const rawLabel = status ? status.replaceAll('_', ' ') : 'UNKNOWN';
  const label = translate(status, lang) || rawLabel;
  const emoji = STATUS_EMOJIS[status] || '❓';

  return (
    <span className="status-badge d-inline-flex align-items-center gap-1" style={{ backgroundColor: color }}>
      <span>{emoji}</span>
      <span>{label}</span>
    </span>
  );
}

