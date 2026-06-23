import { useState } from 'react';

export default function FileUploadBox({ onImagesChange, onVideoChange }) {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState(null);

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    onImagesChange(files);
    setImagePreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleVideo = (e) => {
    const file = e.target.files?.[0] || null;
    onVideoChange(file);
    setVideoPreview(file ? URL.createObjectURL(file) : null);
  };

  return (
    <div>
      <div className="mb-3">
        <label className="form-label">Photos (you can select multiple)</label>
        <input type="file" accept="image/*" multiple className="form-control" onChange={handleImages} />
        <div className="d-flex gap-2 mt-2 flex-wrap">
          {imagePreviews.map((src, i) => (
            <img key={i} src={src} alt="" style={{ width: 80, height: 80, objectFit: 'cover' }} className="rounded border" />
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Video (optional, one only)</label>
        <input type="file" accept="video/*" className="form-control" onChange={handleVideo} />
        {videoPreview && (
          <video src={videoPreview} controls style={{ width: 200, marginTop: 8 }} />
        )}
      </div>
    </div>
  );
}
