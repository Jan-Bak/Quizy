import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './../styles/QuizProgress.module.css';

interface QuizProgressProps {
  currentIndex: number;
  totalQuestions: number;
}

const QuizProgress: React.FC<QuizProgressProps> = ({ currentIndex, totalQuestions }) => {
  const { t } = useTranslation();

  return (
    <div className={styles['quiz-progress']}>
      <div className={styles['quiz-progress__question-count']}>
        {t('quiz.questionOf', { current: currentIndex + 1, total: totalQuestions })}
      </div>
    </div>
  );
};

export default QuizProgress;
