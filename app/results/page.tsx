'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ImageAnalysis from '../components/ImageAnalysis';
import styles from './results.module.css';

interface ResultData {
  score: number;
  suggestions: string[];
  observations: string[];
  imageUrl: string;
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [resultData, setResultData] = useState<ResultData | null>(null);

  useEffect(() => {
    // Get data from URL parameters
    if (!searchParams) return;

    const score = searchParams.get('score');
    const suggestions = searchParams.get('suggestions');
    const observations = searchParams.get('observations');
    const imageUrl = searchParams.get('image');

    if (score && imageUrl) {
      try {
        // Safe parsing with error handling
        let parsedSuggestions = [];
        let parsedObservations = [];
        let parsedImageUrl = '';

        // Parse suggestions safely
        if (suggestions) {
          try {
            parsedSuggestions = JSON.parse(decodeURIComponent(suggestions));
          } catch (error) {
            console.warn('Failed to parse suggestions:', error);
            parsedSuggestions = [
              'Get a textured crop haircut with mid fade to enhance facial structure',
              'Start a daily skincare routine: gentle cleanser AM/PM, moisturizer with SPF 30+',
              'Reduce body fat through regular exercise and proper nutrition'
            ];
          }
        }

        // Parse observations safely
        if (observations) {
          try {
            parsedObservations = JSON.parse(decodeURIComponent(observations));
          } catch (error) {
            console.warn('Failed to parse observations:', error);
            parsedObservations = [
              'Photo analyzed with standard lighting and composition',
              'Natural facial expression and posture detected',
              'Current grooming and style choices assessed'
            ];
          }
        }

        // Parse image URL safely
        try {
          parsedImageUrl = decodeURIComponent(imageUrl);
        } catch (error) {
          console.warn('Failed to parse image URL:', error);
          // If image URL fails, redirect back to upload
          router.push('/upload');
          return;
        }

        setResultData({
          score: parseInt(score),
          suggestions: parsedSuggestions,
          observations: parsedObservations,
          imageUrl: parsedImageUrl
        });
      } catch (error) {
        console.error('Error parsing URL parameters:', error);
        // If parsing fails completely, redirect back to upload
        router.push('/upload');
      }
    } else {
      // If no data, redirect back to upload
      router.push('/upload');
    }
  }, [searchParams, router]);

  const handleBackToUpload = () => {
    router.push('/upload');
  };

  const handleGenerateTransformation = () => {
    if (!resultData) return;

    // Navigate to transformation page with current data including original image
    const transformationParams = new URLSearchParams({
      score: resultData.score.toString(),
      suggestions: encodeURIComponent(JSON.stringify(resultData.suggestions)),
      observations: encodeURIComponent(JSON.stringify(resultData.observations)),
      image: encodeURIComponent(resultData.imageUrl)
    });

    router.push(`/transformation?${transformationParams.toString()}`);
  };

  if (!resultData) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingText}>Loading your results...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <ImageAnalysis
        imageUrl={resultData.imageUrl}
        score={resultData.score}
        observations={resultData.observations}
        suggestions={resultData.suggestions}
        isLoading={false}
      />

      {/* Transformation Section */}
      <div className={styles.transformationSection}>
        <div className={styles.transformationCard}>
          <h3 className={styles.transformationTitle}>🚀 See Your Potential</h3>
          <p className={styles.transformationDescription}>
            Wonder how you could look if you implemented these looksmaxxing
            changes? Our AI will generate a transformation showing your
            potential glow-up.
          </p>
          <button
            onClick={handleGenerateTransformation}
            className={styles.transformationButton}
          >
            Generate Your Transformation
          </button>
        </div>
      </div>

      <div className={styles.actionSection}>
        <button onClick={handleBackToUpload} className={styles.backButton}>
          Upload Another Image
        </button>

        <div className={styles.shareSection}>
          <h3 className={styles.shareTitle}>Share Your Mog Score</h3>
          <div className={styles.shareButtons}>
            <button
              className={styles.shareButton}
              onClick={() => {
                const text = `I got a Mog Score of ${resultData.score}/100! 😎`;
                navigator.clipboard.writeText(text);
                alert('Copied to clipboard!');
              }}
            >
              Copy Score
            </button>
            <button
              className={styles.shareButton}
              onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
              }}
            >
              Share Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.loading}>
          <div className={styles.loadingText}>Loading your results...</div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
