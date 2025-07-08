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
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem'
      }}
    >
      <h1>Upload your photo</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setSelectedFile(e.target.files ? e.target.files[0] : null)
          }
        />
        <button type="submit" disabled={!selectedFile || loading}>
          Upload & Ascend
        </button>
      </form>

      {loading && <p>Analyzing photo...</p>}

      {selectedFile && (
        <div>
          <h2>Preview:</h2>
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="preview"
            style={{ maxWidth: '300px' }}
          />
        </div>
      )}

      {result && (
        <div
          style={{
            maxWidth: '100%',
            wordBreak: 'break-word',
            overflowX: 'auto'
          }}
        >
          <h2>Results:</h2>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxWidth: '100%',
              overflowX: 'auto',
              padding: '1em',
              borderRadius: '8px'
            }}
          >
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
