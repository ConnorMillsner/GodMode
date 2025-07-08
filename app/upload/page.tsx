'use client';

import React, { useState } from 'react';
import styles from './upload.module.css';

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
    <div className={styles.container}>
      <h1>Upload your photo</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.fileInput}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
            style={{ display: 'none' }}
          />
          {selectedFile ? selectedFile.name : 'Select Image File'}
        </label>
        <button
          type="submit"
          disabled={!selectedFile || loading}
          className={styles.button}
        >
          {loading ? 'Processing...' : 'Upload & Ascend'}
        </button>
      </form>
      {selectedFile && (
        <div className={styles.preview}>
          <h2>Preview</h2>
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="preview"
          />
        </div>
      )}
      {result && (
        <div className={styles.result}>
          <h2>Results</h2>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
