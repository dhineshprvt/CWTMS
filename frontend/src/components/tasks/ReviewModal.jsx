import { useState } from 'react';
import AttachmentGallery from './AttachmentGallery';
import TaskHistoryTimeline from './TaskHistoryTimeline';

export default function ReviewModal({ task, attachments, history, onDecision, onClose }) {
  const [remarks, setRemarks] = useState('');

  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{task.title}</h5>
            <button className="btn-close" onClick={onClose} />
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-7">
                <h6>Proof of work</h6>
                <AttachmentGallery attachments={attachments} />

                <h6 className="mt-4">Remarks to worker (optional)</h6>
                <textarea className="form-control" rows={2} value={remarks}
                          onChange={(e) => setRemarks(e.target.value)} />
              </div>
              <div className="col-md-5">
                <h6>Status History</h6>
                <TaskHistoryTimeline history={history} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-success" onClick={() => onDecision('APPROVED', remarks)}>Approve</button>
            <button className="btn btn-warning" onClick={() => onDecision('REWORK_REQUIRED', remarks)}>Request Rework</button>
            <button className="btn btn-danger" onClick={() => onDecision('REJECTED', remarks)}>Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
}
