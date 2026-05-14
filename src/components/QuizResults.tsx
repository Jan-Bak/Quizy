import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './../styles/QuizResults.module.css';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onBackToList: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  onRestart,
  onBackToList,
}) => {
  const { t } = useTranslation();
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className={styles['quiz-results']}>
      <h2 className={styles['quiz-results__title']}>{t('results.complete')}</h2>
      <div className={styles['quiz-results__score']}>
        {t('results.score')}: {score} / {totalQuestions}
      </div>
      <div className={styles['quiz-results__percentage']}>
        {t('results.percentage')}: {percentage}%
      </div>
      <div className={styles['quiz-results__buttons']}>
        <button onClick={onRestart} className={styles['quiz-results__button']}>
          {t('results.restart')}
        </button>
        <button onClick={onBackToList} className={styles['quiz-results__button']}>
          {t('results.backToList')}
        </button>
      </div>
    </div>
  );
};

export default QuizResults;
