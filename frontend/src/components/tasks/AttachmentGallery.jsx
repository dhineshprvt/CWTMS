const FILE_BASE_URL = 'http://localhost:8080/';

export default function AttachmentGallery({ attachments }) {
  if (!attachments || attachments.length === 0) {
    return <p className="text-muted">No files uploaded yet.</p>;
  }
  return (
    <div className="d-flex flex-wrap gap-3">
      {attachments.map((a) => (
        <div key={a.id} style={{ width: 160 }}>
          {a.fileType === 'IMAGE' ? (
            <img src={FILE_BASE_URL + a.filePath} alt={a.fileName}
                 className="img-fluid rounded border" style={{ height: 120, objectFit: 'cover', width: '100%' }} />
          ) : (
            <video src={FILE_BASE_URL + a.filePath} controls
                   className="rounded border" style={{ height: 120, width: '100%' }} />
          )}
          <div className="small text-truncate mt-1">{a.fileName}</div>
        </div>
      ))}
    </div>
  );
}
