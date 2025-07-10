'use client';

import React from 'react';
import styles from './ImageAnalysis.module.css';

interface ImageAnalysisProps {
  imageUrl: string;
  score: number;
  observations: string[];
  suggestions: string[];
  isLoading?: boolean;
}

export default function ImageAnalysis({ imageUrl, score, observations, suggestions, isLoading = false }: ImageAnalysisProps) {
  const getScoreColor = (score: number) => {
    if (score <= 15) return '#8B0000'; // Dark Red
    if (score <= 30) return '#FF0000'; // Red
    if (score <= 45) return '#FF4500'; // Orange
    if (score <= 60) return '#FFFF00'; // Yellow
    if (score <= 75) return '#32CD32'; // Green
    if (score <= 90) return '#0066FF'; // Blue
    return '#9400D3'; // Purple
  };

  const getScoreLabel = (score: number) => {
    if (score <= 15) return 'Subhuman';
    if (score <= 30) return 'Incel';
    if (score <= 45) return 'Loser';
    if (score <= 60) return 'Normie';
    if (score <= 75) return 'Chad';
    if (score <= 90) return 'Gigachad';
    return 'God Tier';
  };

  const getScoreExplanation = (score: number) => {
    if (score <= 15) return 'Significant room for improvement in all areas. Focus on basic grooming and style fundamentals.';
    if (score <= 30) return 'Below average presentation. Work on skincare, haircut, and overall grooming routine.';
    if (score <= 45) return 'Room for improvement. Update your style, improve grooming habits, and work on confidence.';
    if (score <= 60) return 'Average presentation. You\'re doing okay but could elevate your style and grooming game.';
    if (score <= 75) return 'Above average! You have good style sense and grooming. Fine-tune the details.';
    if (score <= 90) return 'Excellent presentation! You have strong style and grooming. Minor optimizations only.';
    return 'Elite tier! Outstanding style, grooming, and overall presentation. You\'re setting the standard.';
  };

  const getThemeClass = (score: number) => {
    if (score <= 15) return styles.themeSubhuman;
    if (score <= 30) return styles.themeIncel;
    if (score <= 45) return styles.themeLoser;
    if (score <= 60) return styles.themeNormie;
    if (score <= 75) return styles.themeChad;
    if (score <= 90) return styles.themeGigachad;
    return styles.themeGodTier;
  };

  return (
    <div className={`${styles.container} ${getThemeClass(score)}`}>
      {/* Main Content Grid */}
      <div className={styles.mainGrid}>
        
        {/* Left Side - Observations */}
        <div className={styles.leftPanel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>AI Observations</h3>
          </div>
          {observations && observations.length > 0 && !isLoading ? (
            <div className={styles.cardList}>
              {observations.map((observation, index) => (
                <div key={index} className={styles.observationCard}>
                  <div className={styles.cardNumber}>{index + 1}</div>
                  <p className={styles.cardText}>{observation}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.loadingCard}>
              <p>Analyzing your photo...</p>
            </div>
          )}
        </div>

        {/* Center - Image with Score */}
        <div className={styles.centerPanel}>
          <div className={styles.imageContainer}>
            <img src={imageUrl} alt="Analysis" className={styles.image} />
            
            {/* Score Overlay - Moved to forehead area */}
            <div className={styles.scoreOverlay}>
              <div 
                className={styles.scoreCircle}
                style={{ borderColor: isLoading ? '#666' : getScoreColor(score) }}
              >
                <span 
                  className={styles.scoreNumber}
                  style={{ color: isLoading ? '#666' : getScoreColor(score) }}
                >
                  {isLoading ? '...' : score}
                </span>
                <span className={styles.scoreMax}>/100</span>
              </div>
              <div 
                className={styles.scoreLabel}
                style={{ color: isLoading ? '#666' : getScoreColor(score) }}
              >
                {isLoading ? 'Analyzing...' : getScoreLabel(score)}
              </div>
            </div>
          </div>

          {/* Score Explanation */}
          <div className={styles.explanationBox}>
            <h4 className={styles.explanationTitle}>Your Ranking Explained</h4>
            <p className={styles.explanationText}>
              {isLoading ? 'Processing your analysis...' : getScoreExplanation(score)}
            </p>
          </div>
        </div>

        {/* Right Side - Suggestions */}
        <div className={styles.rightPanel}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Improvements</h3>
          </div>
          {suggestions && suggestions.length > 0 && !isLoading ? (
            <div className={styles.cardList}>
              {suggestions.map((suggestion, index) => (
                <div key={index} className={styles.suggestionCard}>
                  <div className={styles.cardNumber}>{index + 1}</div>
                  <p className={styles.cardText}>{suggestion}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.loadingCard}>
              <p>Generating suggestions...</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom - Ranking Scale */}
      <div className={styles.rankingScale}>
        <h3 className={styles.scaleTitle}>Complete Mog Scale Breakdown</h3>
        <div className={styles.scaleBar}>
          <div className={styles.scaleSegment} style={{background: '#8B0000', flex: '15'}}>
            <span className={styles.scaleLabel}>1-15<br/>Subhuman</span>
          </div>
          <div className={styles.scaleSegment} style={{background: '#FF0000', flex: '15'}}>
            <span className={styles.scaleLabel}>16-30<br/>Incel</span>
          </div>
          <div className={styles.scaleSegment} style={{background: '#FF4500', flex: '15'}}>
            <span className={styles.scaleLabel}>31-45<br/>Loser</span>
          </div>
          <div className={styles.scaleSegment} style={{background: '#FFFF00', flex: '15'}}>
            <span className={styles.scaleLabel}>46-60<br/>Normie</span>
          </div>
          <div className={styles.scaleSegment} style={{background: '#32CD32', flex: '15'}}>
            <span className={styles.scaleLabel}>61-75<br/>Chad</span>
          </div>
          <div className={styles.scaleSegment} style={{background: '#0066FF', flex: '15'}}>
            <span className={styles.scaleLabel}>76-90<br/>Gigachad</span>
          </div>
          <div className={styles.scaleSegment} style={{background: '#9400D3', flex: '10'}}>
            <span className={styles.scaleLabel}>91-100<br/>God Tier</span>
          </div>
        </div>
        <div className={styles.scaleIndicator} style={{left: `${score}%`}}>
          <div className={styles.scaleArrow}></div>
          <span className={styles.scaleValue}>You scored: {score}/100</span>
        </div>
      </div>
    </div>
  );
} 