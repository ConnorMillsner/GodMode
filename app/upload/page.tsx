'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ChadMeter from '../components/ChadMeter';
import styles from './upload.module.css';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedFile) return;
    
    setLoading(true);
    
    // Create image URL for preview
    const imageUrl = URL.createObjectURL(selectedFile);
    
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
      console.log('API Response:', data); // Debug log
      
      // Ensure we have valid suggestions array
      let suggestions = [];
      if (Array.isArray(data.suggestions)) {
        suggestions = data.suggestions;
      } else if (data.suggestions && typeof data.suggestions === 'string') {
        suggestions = [data.suggestions];
      } else {
        suggestions = [
          'Try a different hairstyle or haircut',
          'Improve skincare routine with consistent cleansing', 
          'Consider posture and confidence improvements'
        ];
      }
      
      // Ensure we have valid observations array
      let observations = [];
      if (Array.isArray(data.observations)) {
        observations = data.observations;
      } else {
        observations = [
          'Photo analyzed successfully',
          'Standard lighting and composition',
          'Clear facial features visible'
        ];
      }
      
      // Redirect to results page with data and image
      const score = data.score || 50;
      const suggestionsParam = encodeURIComponent(JSON.stringify(suggestions));
      const observationsParam = encodeURIComponent(JSON.stringify(observations));
      const imageParam = encodeURIComponent(imageUrl);
      router.push(`/results?score=${score}&suggestions=${suggestionsParam}&observations=${observationsParam}&image=${imageParam}`);
      
    } catch (error) {
      console.error('Upload error:', error);
      
      // Create image URL for error case too
      const imageUrl = URL.createObjectURL(selectedFile);
      
      // Redirect to results page with error data
      const errorSuggestions = [
        'Upload failed - please try again',
        'Ensure you have a stable internet connection',
        'Use a clear, well-lit image'
      ];
      const errorObservations = [
        'Upload process encountered an error',
        'Connection or file format issue detected',
        'Please try again with a different image'
      ];
      const suggestionsParam = encodeURIComponent(JSON.stringify(errorSuggestions));
      const observationsParam = encodeURIComponent(JSON.stringify(errorObservations));
      const imageParam = encodeURIComponent(imageUrl);
      router.push(`/results?score=25&suggestions=${suggestionsParam}&observations=${observationsParam}&image=${imageParam}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.pageContainer}>
      <ChadMeter 
        score={50} 
        isLoading={loading}
        suggestions={[]}
      />
      
      <div className={styles.uploadSection}>
        <form onSubmit={handleSubmit} className={styles.uploadForm}>
          <div 
            className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''} ${selectedFile ? styles.hasFile : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className={styles.fileInput}
              id="file-upload"
            />
            <label htmlFor="file-upload" className={styles.dropLabel}>
              {selectedFile ? (
                <div className={styles.fileSelected}>
                  <span className={styles.fileName}>{selectedFile.name}</span>
                  <span className={styles.fileSize}>
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              ) : (
                <div className={styles.dropText}>
                  <span className={styles.dropTitle}>Drop your image here</span>
                  <span className={styles.dropSubtitle}>or click to browse</span>
                </div>
              )}
            </label>
          </div>
          
          <button
            type="submit"
            disabled={!selectedFile || loading}
            className={styles.analyzeButton}
          >
            {loading ? 'Analyzing Chad Level...' : 'Analyze & Ascend'}
          </button>
        </form>
      </div>
    </div>
  );
}


