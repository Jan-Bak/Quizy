import React from 'react';
import styles from './../styles/QuizProgress.module.css';

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
}

const QuizProgress: React.FC<QuizProgressProps> = ({ currentIndex, totalQuestions }) => {
  return (
    <div className={styles['quiz-progress']}>
      <div className={styles['quiz-progress__question-count']}>
        Question {currentIndex + 1} of {totalQuestions}
      </div>
    </div>
  );
};

export default QuizProgress;
