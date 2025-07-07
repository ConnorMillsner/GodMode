'use client';

import React, { useState } from 'react';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!selectedFile) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Upload your photo</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
        />
        <button type="submit" disabled={!selectedFile || loading}>
          Upload & Ascend
        </button>
      </form>

      {loading && <p>Analyzing photo...</p>}

      {selectedFile && (
        <div>
          <h2>Preview:</h2>
          <img src={URL.createObjectURL(selectedFile)} alt="preview" style={{ maxWidth: '300px' }} />
        </div>
      )}

      {result && (
        <div>
          <h2>Results:</h2>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
