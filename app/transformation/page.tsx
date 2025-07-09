'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './transformation.module.css';

interface TransformationData {
  originalScore: number;
  transformedScore: number;
  suggestions: string[];
  observations: string[];
  originalImageUrl: string;
  transformedImageUrl?: string;
  isLoading: boolean;
  error?: string;
  fallbackMessage?: string;
}

export default function TransformationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [transformationData, setTransformationData] =
    useState<TransformationData | null>(null);

  useEffect(() => {
    if (!searchParams) return;

    const score = searchParams.get('score');
    const suggestions = searchParams.get('suggestions');
    const observations = searchParams.get('observations');
    const imageUrl = searchParams.get('image');

    if (score && suggestions && imageUrl) {
      try {
        const parsedSuggestions = JSON.parse(decodeURIComponent(suggestions!));
        const parsedObservations = JSON.parse(
          decodeURIComponent(observations!)
        );
        const parsedImageUrl = decodeURIComponent(imageUrl);
        const parsedScore = parseInt(score);

        setTransformationData({
          originalScore: parsedScore,
          transformedScore: 0,
          suggestions: parsedSuggestions,
          observations: parsedObservations,
          originalImageUrl: parsedImageUrl,
          isLoading: true
        });

        // Generate transformation
        generateTransformation(
          parsedSuggestions,
          parsedObservations,
          parsedScore,
          parsedImageUrl
        );
      } catch (error) {
        console.error('Error parsing transformation parameters:', error);
        router.push('/upload');
      }
    } else {
      router.push('/upload');
    }
  }, [searchParams, router]);

  const generateTransformation = async (
    suggestions: string[],
    observations: string[],
    score: number,
    originalImageUrl: string
  ) => {
    try {
      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          suggestions,
          observations,
          score,
          originalImageUrl
        })
      });

      const data = await response.json();

      if (data.success) {
        setTransformationData((prev) =>
          prev
            ? {
                ...prev,
                transformedImageUrl: data.imageUrl,
                transformedScore: data.transformedScore,
                isLoading: false
              }
            : null
        );
      } else {
        setTransformationData((prev) =>
          prev
            ? {
                ...prev,
                error: data.error,
                fallbackMessage: data.fallbackMessage,
                transformedScore: data.transformedScore,
                isLoading: false
              }
            : null
        );
      }
    } catch (error) {
      console.error('Transformation generation failed:', error);
      setTransformationData((prev) =>
        prev
          ? {
              ...prev,
              error: 'Failed to generate transformation',
              fallbackMessage:
                'Transformation generation is temporarily unavailable. Your potential improvement would be significant.',
              transformedScore: Math.min(100, score + 20),
              isLoading: false
            }
          : null
      );
    }
  };

  const handleBackToResults = () => {
    if (!transformationData) return;

    const resultsParams = new URLSearchParams({
      score: transformationData.originalScore.toString(),
      suggestions: encodeURIComponent(
        JSON.stringify(transformationData.suggestions)
      ),
      observations: encodeURIComponent(
        JSON.stringify(transformationData.observations)
      ),
      image: encodeURIComponent(transformationData.originalImageUrl)
    });

    router.push(`/results?${resultsParams.toString()}`);
  };

  const handleBackToUpload = () => {
    router.push('/upload');
  };

  if (!transformationData) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingText}>Loading transformation...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>🚀 Your Transformation</h1>
        <p className={styles.subtitle}>
          See how you could look with looksmaxxing improvements
        </p>
      </div>

      <div className={styles.comparisonSection}>
        <div className={styles.imageComparison}>
          {/* Original Image */}
          <div className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              <Image
                src={transformationData.originalImageUrl}
                alt="Original"
                className={styles.image}
                width={400}
                height={400}
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.imageLabel}>
                <h3>Before</h3>
                <div className={styles.scoreDisplay}>
                  <span className={styles.score}>
                    {transformationData.originalScore}
                  </span>
                  <span className={styles.scoreMax}>/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className={styles.arrow}>
            <div className={styles.arrowIcon}>→</div>
          </div>

          {/* Transformed Image */}
          <div className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              {transformationData.isLoading ? (
                <div className={styles.loadingPlaceholder}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Generating your transformation...</p>
                </div>
              ) : transformationData.error ? (
                <div className={styles.errorPlaceholder}>
                  <div className={styles.errorIcon}>⚠️</div>
                  <p>{transformationData.fallbackMessage}</p>
                </div>
              ) : (
                transformationData.transformedImageUrl && (
                  <Image
                    src={transformationData.transformedImageUrl}
                    alt="Transformed"
                    className={styles.image}
                    width={400}
                    height={400}
                    style={{ objectFit: 'cover' }}
                  />
                )
              )}
              <div className={styles.imageLabel}>
                <h3>After</h3>
                <div className={styles.scoreDisplay}>
                  <span className={styles.score}>
                    {transformationData.transformedScore}
                  </span>
                  <span className={styles.scoreMax}>/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Improvement Summary */}
        <div className={styles.improvementSummary}>
          <h3 className={styles.improvementTitle}>Potential Improvement</h3>
          <div className={styles.scoreImprovement}>
            <span className={styles.scoreIncrease}>
              +
              {transformationData.transformedScore -
                transformationData.originalScore}{' '}
              points
            </span>
            <span className={styles.improvementText}>
              ({transformationData.originalScore} →{' '}
              {transformationData.transformedScore})
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionSection}>
        <button onClick={handleBackToResults} className={styles.backButton}>
          Back to Results
        </button>
        <button onClick={handleBackToUpload} className={styles.uploadButton}>
          Upload New Image
        </button>
      </div>
    </div>
  );
}
