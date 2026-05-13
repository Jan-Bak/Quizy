import React from 'react';
import styles from './../styles/QuizResults.module.css';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onBackToList: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  onRestart,
  onBackToList,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className={styles['quiz-results']}>
      <h2 className={styles['quiz-results__title']}>Quiz Complete!</h2>
      <div className={styles['quiz-results__score']}>
        Score: {score} / {totalQuestions}
      </div>
      <div className={styles['quiz-results__percentage']}>Percentage: {percentage}%</div>
      <div className={styles['quiz-results__buttons']}>
        <button onClick={onRestart} className={styles['quiz-results__button']}>
          Restart Quiz
        </button>
        <button onClick={onBackToList} className={styles['quiz-results__button']}>
          Back to List
        </button>
      </div>
    </div>
  );
};
