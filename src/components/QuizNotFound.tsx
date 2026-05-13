import React from 'react';
import styles from './../styles/QuizNotFound.module.css';

interface QuizNotFoundProps {
  onBackToList: () => void;
}

export const QuizNotFound: React.FC<QuizNotFoundProps> = ({ onBackToList }) => {
  return (
    <div className={styles['quiz-not-found']}>
      <p className={styles['quiz-not-found__message']}>Quiz not found</p>
      <button onClick={onBackToList} className={styles['quiz-not-found__button']}>
        Go back
      </button>
    </div>
  );
};
