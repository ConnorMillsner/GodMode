'use client';

import React from 'react';
import styles from './ChadMeter.module.css';

interface ChadMeterProps {
  score: number;
  isLoading?: boolean;
  suggestions?: string[];
}

export default function ChadMeter({ score, isLoading = false, suggestions = [] }: ChadMeterProps) {
  const getScoreColor = (score: number) => {
    if (score <= 25) return '#ff0000'; // Red
    if (score <= 50) return '#ffff00'; // Yellow
    if (score <= 75) return '#00ff00'; // Green
    return '#0066ff'; // Blue
  };

  const getScoreLabel = (score: number) => {
    if (score <= 25) return 'Subhuman';
    if (score <= 50) return 'Normie';
    if (score <= 75) return 'Chad';
    return 'Gigachad';
  };

  // Debug log for suggestions
  console.log('ChadMeter suggestions:', suggestions);

  return (
    <div className={styles.container}>
      <div className={styles.meterContainer}>
        <h1 className={styles.title}>Upload your face to see mog score</h1>
        
        <div className={styles.scoreDisplay}>
          <span 
            className={styles.scoreNumber}
            style={{ color: isLoading ? '#666' : getScoreColor(score) }}
          >
            {isLoading ? '...' : score}
          </span>
          <span className={styles.scoreMax}>/100</span>
        </div>

        <div className={styles.sliderContainer}>
          <div className={styles.sliderTrack}>
            <div 
              className={styles.sliderFill}
              style={{ 
                width: `${score}%`,
                backgroundColor: isLoading ? '#333' : getScoreColor(score),
                transition: 'all 1s ease-in-out'
              }}
            />
            <div 
              className={styles.sliderThumb}
              style={{ 
                left: `${score}%`,
                backgroundColor: isLoading ? '#666' : getScoreColor(score),
                transition: 'all 1s ease-in-out'
              }}
            />
          </div>
          
          <div className={styles.sliderLabels}>
            <span className={styles.labelLeft}>1 - Subhuman</span>
            <span className={styles.labelRight}>100 - Gigachad</span>
          </div>
        </div>

        <div className={styles.scoreLabel}>
          {isLoading ? 'Analyzing...' : getScoreLabel(score)}
        </div>
      </div>

      {suggestions && suggestions.length > 0 && (
        <div className={styles.suggestionsContainer}>
          <h2 className={styles.suggestionsTitle}>How to improve your mog potential:</h2>
          <ul className={styles.suggestionsList}>
            {suggestions.map((suggestion, index) => (
              <li key={index} className={styles.suggestionItem}>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 