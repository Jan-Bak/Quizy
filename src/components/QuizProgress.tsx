import React from 'react';
import styles from './../styles/QuizProgress.module.css';

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
  answeredCount: number;
  showAnsweredCount?: boolean;
}

export const QuizProgress: React.FC<QuizProgressProps> = ({
  currentIndex,
  totalQuestions,
  answeredCount,
  showAnsweredCount = true,
}) => {
  return (
    <div className={styles['quiz-progress']}>
      <div className={styles['quiz-progress__question-count']}>
        Question {currentIndex + 1} of {totalQuestions}
      </div>
      {showAnsweredCount && (
        <div className={styles['quiz-progress__answered-count']}>
          Answered: {answeredCount} / {totalQuestions}
        </div>
      )}
    </div>
  );
};
