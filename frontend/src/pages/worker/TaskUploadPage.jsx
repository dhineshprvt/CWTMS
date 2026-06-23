import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FileUploadBox from '../../components/tasks/FileUploadBox';
import AttachmentGallery from '../../components/tasks/AttachmentGallery';
import { SpeakerButton } from '../../components/tasks/TaskTable';
import taskService from '../../services/taskService';
import { translate } from '../../utils/translations';

export default function TaskUploadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem('cwtms_lang') || 'en');
  const [translatedTask, setTranslatedTask] = useState(null);

  const load = () => {
    taskService.getById(id).then((res) => setTask(res.data));
    taskService.attachments(id).then((res) => setAttachments(res.data));
  };

  useEffect(() => {
    load();
    const handler = () => {
      setLang(localStorage.getItem('cwtms_lang') || 'en');
    };
    window.addEventListener('cwtms_lang_change', handler);
    return () => window.removeEventListener('cwtms_lang_change', handler);
  }, [id]);

  const handleUploadFiles = async () => {
    setError('');
    if (images.length === 0 && !video) {
      setError(translate('selectPhotoError', lang));
      return;
    }
    const formData = new FormData();
    images.forEach((img) => formData.append('images', img));
    if (video) formData.append('video', video);

    try {
      await taskService.uploadAttachments(id, formData);
      setImages([]);
      setVideo(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || translate('uploadFailed', lang));
    }
  };

  const handleSubmitForReview = async () => {
    setError('');
    setSubmitting(true);
    try {
      await taskService.submit(id, remarks);
      navigate('/worker/tasks');
    } catch (err) {
      setError(err.response?.data?.message || translate('submitError', lang));
    } finally {
      setSubmitting(false);
    }
  };

  if (!task) return <p className="text-muted p-3">{translate('loading', lang)}</p>;

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-3">
        <h4 className="mb-0">{translate('uploadProof', lang)} — {task.title}</h4>
        <SpeakerButton 
          title={task.title} 
          description={task.description} 
          lang={lang} 
          onTranslate={(title, desc) => setTranslatedTask({ title, desc })}
        />
      </div>
      <p className="text-muted">{task.description}</p>

      {translatedTask && lang !== 'en' && (
        <div className="mb-4 p-3 rounded border-start border-primary border-3 bg-white shadow-sm">
          <div className="fw-bold text-primary text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>
            {lang.toUpperCase()} Translation:
          </div>
          <div className="fw-semibold text-dark small">{translatedTask.title}</div>
          {translatedTask.desc && (
            <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
              {translatedTask.desc}
            </div>
          )}
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <h6>{translate('alreadyUploaded', lang)}</h6>
        <AttachmentGallery attachments={attachments} />
      </div>

      <div className="bg-white p-4 rounded shadow-sm mb-4">
        <h6>{translate('addPhotosVideo', lang)}</h6>
        <FileUploadBox onImagesChange={setImages} onVideoChange={setVideo} />
        <button className="btn btn-outline-primary mt-3" onClick={handleUploadFiles}>
          {translate('uploadSelected', lang)}
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow-sm">
        <h6>{translate('remarks', lang)}</h6>
        <textarea className="form-control mb-3" rows={3} value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={translate('describeDone', lang)} />
        <button className="btn btn-success" onClick={handleSubmitForReview} disabled={submitting}>
          {submitting ? translate('submitting', lang) : translate('submitReview', lang)}
        </button>
      </div>
    </div>
  );
}

