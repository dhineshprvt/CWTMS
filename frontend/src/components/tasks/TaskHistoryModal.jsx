import AttachmentGallery from './AttachmentGallery';
import TaskHistoryTimeline from './TaskHistoryTimeline';
import { CATEGORY_LABELS } from '../../utils/statusColors';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/dateFormat';

export default function TaskHistoryModal({ task, attachments, history, onClose }) {
  return (
    <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Task History &amp; Details</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
          </div>
          <div className="modal-body">
            <div className="bg-light p-3 rounded mb-4">
              <h5 className="text-primary mb-2">{task.title}</h5>
              {task.description && <p className="text-muted mb-3">{task.description}</p>}
              <div className="row g-2 small">
                <div className="col-sm-6">
                  <strong>Category:</strong> {task.category === 'OTHER' ? (task.customCategory || 'Other') : (CATEGORY_LABELS[task.category] || task.category)}
                </div>
                <div className="col-sm-6">
                  <strong>Location:</strong> {task.location || 'N/A'}
                </div>
                <div className="col-sm-6">
                  <strong>Status:</strong> <StatusBadge status={task.status} />
                </div>
                <div className="col-sm-6">
                  <strong>Due Date:</strong> {formatDate(task.dueDate)}
                </div>
                <div className="col-sm-6">
                  <strong>Assigned To:</strong> {task.assignedToName || 'Unassigned'}
                </div>
                <div className="col-sm-6">
                  <strong>Created By:</strong> {task.createdByName || 'N/A'}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-7 border-end">
                <h6 className="border-bottom pb-2 mb-3">Proof of Work / Attachments</h6>
                <AttachmentGallery attachments={attachments} />
              </div>
              <div className="col-md-5">
                <h6 className="border-bottom pb-2 mb-3">Status History Timeline</h6>
                <TaskHistoryTimeline history={history} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}
