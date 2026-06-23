import { useState, useEffect } from 'react';
import { FaVolumeUp, FaPlay, FaRedo, FaUpload, FaHistory, FaInfoCircle } from 'react-icons/fa';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/dateFormat';
import { translate } from '../../utils/translations';

export function SpeakerButton({ title, description, lang, onTranslate }) {
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voiceMissing, setVoiceMissing] = useState(false);

  // Trigger loading voices so they are ready
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const speak = async () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const rawText = `${title}. ${description || ''}`;
    setLoading(true);

    try {
      let textToSpeak = rawText;
      let translatedTitle = title;
      let translatedDesc = description;
      
      // Translate if language is not English
      if (lang !== 'en') {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(rawText)}&langpair=en|${lang}`
        );
        const data = await response.json();
        if (data.responseData?.translatedText) {
          textToSpeak = data.responseData.translatedText;
          
          // Split title and description based on separator punctuation
          const parts = textToSpeak.split('.');
          translatedTitle = parts[0]?.trim() || title;
          translatedDesc = parts.slice(1).join('.').trim() || description;
          
          if (onTranslate) {
            onTranslate(translatedTitle, translatedDesc);
          }
        }
      }

      setLoading(false);
      setSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      const langCodes = {
        en: 'en-US',
        ta: 'ta-IN',
        hi: 'hi-IN',
        te: 'te-IN',
        kn: 'kn-IN',
        ml: 'ml-IN'
      };
      const targetLang = langCodes[lang] || 'en-US';
      utterance.lang = targetLang;

      // Try to select high-quality native regional voice
      const voices = window.speechSynthesis.getVoices();
      let voice = voices.find(v => v.lang.toLowerCase() === targetLang.toLowerCase());
      if (!voice) {
        voice = voices.find(v => v.lang.toLowerCase().startsWith(lang));
      }

      if (voice) {
        utterance.voice = voice;
        setVoiceMissing(false);
      } else if (lang !== 'en') {
        // Voice package is missing on this system.
        // Fall back to speaking the English text so the audio is not silent, while displaying translated text on screen.
        setVoiceMissing(true);
        utterance.text = rawText;
        utterance.lang = 'en-US';
        const enVoice = voices.find(v => v.lang.toLowerCase().startsWith('en'));
        if (enVoice) {
          utterance.voice = enVoice;
        }
      }

      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('TTS error:', err);
      setLoading(false);
      setSpeaking(false);
    }
  };

  return (
    <div className="d-inline-flex align-items-center">
      <button 
        className={`btn btn-link p-0 ms-2 text-decoration-none ${speaking ? 'text-success' : 'text-primary'}`}
        onClick={(e) => {
          e.stopPropagation();
          speak();
        }}
        disabled={loading}
        title={translate('ttsTitle', lang)}
        style={{ verticalAlign: 'middle' }}
      >
        {loading ? (
          <span className="spinner-border spinner-border-sm text-primary" style={{ width: 14, height: 14 }} />
        ) : (
          <FaVolumeUp size={16} />
        )}
      </button>
      
      {voiceMissing && (
        <span 
          className="ms-2 text-warning d-flex align-items-center" 
          style={{ cursor: 'help' }}
          title={`${translate('voiceMissing', lang)}\n\n${translate('voiceTip', lang)}`}
        >
          <FaInfoCircle size={14} className="text-warning" />
        </span>
      )}
    </div>
  );
}

export default function TaskTable({ tasks, role, onViewHistory, onEdit, onDelete, onReview, onStart, onUpload }) {
  const [lang, setLang] = useState(localStorage.getItem('cwtms_lang') || 'en');
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const handler = () => {
      setLang(localStorage.getItem('cwtms_lang') || 'en');
    };
    window.addEventListener('cwtms_lang_change', handler);
    return () => window.removeEventListener('cwtms_lang_change', handler);
  }, []);

  const handleTaskTranslated = (taskId, title, desc) => {
    setTranslations(prev => ({
      ...prev,
      [taskId]: { title, desc }
    }));
  };

  return (
    <div className="table-responsive bg-white rounded shadow-sm">
      <table className="table align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th>{translate('title', lang)}</th>
            <th>{translate('category', lang)}</th>
            <th>{translate('priority', lang)}</th>
            {role === 'WORKER' ? <th>{translate('supervisor', lang)}</th> : <th>Worker</th>}
            <th>{translate('status', lang)}</th>
            <th>{translate('dueDate', lang)}</th>
            <th>{translate('actions', lang)}</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 && (
            <tr><td colSpan={7} className="text-center text-muted py-4">{translate('noTasks', lang)}</td></tr>
          )}
          {tasks.map((t) => {
            const categoryKey = t.category === 'OTHER' ? 'OTHER' : t.category;
            const translatedCategoryName = translate(categoryKey, lang);
            const categoryDisplay = t.category === 'OTHER' 
              ? `${translatedCategoryName} (${t.customCategory || ''})` 
              : translatedCategoryName;

            return (
              <tr key={t.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <span className="fw-semibold">{t.title}</span>
                    {role === 'WORKER' && (
                      <SpeakerButton 
                        title={t.title} 
                        description={t.description} 
                        lang={lang}
                        onTranslate={(title, desc) => handleTaskTranslated(t.id, title, desc)}
                      />
                    )}
                  </div>
                  {translations[t.id] && lang !== 'en' && (
                    <div className="mt-2 p-2 rounded border-start border-primary border-3 bg-light" style={{ maxWidth: '400px' }}>
                      <div className="fw-bold text-primary text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
                        {lang.toUpperCase()} Translation:
                      </div>
                      <div className="fw-semibold text-dark small">{translations[t.id].title}</div>
                      {translations[t.id].desc && (
                        <div className="text-muted text-wrap mt-1" style={{ fontSize: '0.75rem' }}>
                          {translations[t.id].desc}
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td>{categoryDisplay}</td>
                <td>
                  {t.priority === 'HIGH' ? (
                    <span className="badge bg-danger text-uppercase pulsing-badge px-2 py-1" style={{ fontSize: '0.75rem' }}>
                      🚨 {translate('high', lang)}
                    </span>
                  ) : t.priority === 'MEDIUM' ? (
                    <span className="badge bg-warning text-dark text-uppercase px-2 py-1" style={{ fontSize: '0.75rem' }}>
                      {translate('medium', lang)}
                    </span>
                  ) : (
                    <span className="badge bg-info text-dark text-uppercase px-2 py-1" style={{ fontSize: '0.75rem' }}>
                      {translate('low', lang)}
                    </span>
                  )}
                </td>
                {role === 'WORKER' ? (
                  <td>{t.createdByName || 'N/A'}</td>
                ) : (
                  <td>{t.assignedToName || <span className="text-muted">Unassigned</span>}</td>
                )}
                <td><StatusBadge status={t.status} /></td>
                <td>{formatDate(t.dueDate)}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    {role === 'SUPERVISOR' && onEdit && (
                      <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(t)}>Edit</button>
                    )}
                    {role === 'SUPERVISOR' && onDelete && (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(t)}>Delete</button>
                    )}
                    {onViewHistory && (
                      <button className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1" onClick={() => onViewHistory(t)}>
                        <FaHistory size={11} /> {translate('viewHistory', lang)}
                      </button>
                    )}
                    {role === 'SUPERVISOR' && t.status === 'SUBMITTED_FOR_REVIEW' && onReview && (
                      <button className="btn btn-sm btn-warning" onClick={() => onReview(t)}>Review</button>
                    )}
                    {role === 'WORKER' && t.status === 'ASSIGNED' && onStart && (
                      <button className="btn btn-success d-inline-flex align-items-center gap-2 px-3 py-2 fw-bold shadow-sm" style={{ fontSize: '0.85rem' }} onClick={() => onStart(t)}>
                        <FaPlay size={14} /> {translate('startWork', lang)}
                      </button>
                    )}
                    {role === 'WORKER' && t.status === 'REWORK_REQUIRED' && onStart && (
                      <button className="btn btn-warning text-dark d-inline-flex align-items-center gap-2 px-3 py-2 fw-bold shadow-sm" style={{ fontSize: '0.85rem' }} onClick={() => onStart(t)}>
                        <FaRedo size={14} /> {translate('resumeWork', lang)}
                      </button>
                    )}
                    {role === 'WORKER' && t.status === 'IN_PROGRESS' && onUpload && (
                      <button className="btn btn-primary d-inline-flex align-items-center gap-2 px-3 py-2 fw-bold shadow-sm" style={{ fontSize: '0.85rem' }} onClick={() => onUpload(t)}>
                        <FaUpload size={14} /> {translate('uploadSubmit', lang)}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

