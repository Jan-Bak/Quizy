import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './../styles/QuizNotFound.module.css';

interface QuizNotFoundProps {
  onBackToList: () => void;
}

const QuizNotFound: React.FC<QuizNotFoundProps> = ({ onBackToList }) => {
  const { t } = useTranslation();

  return (
    <div className={styles['quiz-not-found']}>
      <p className={styles['quiz-not-found__message']}>{t('errors.notFound')}</p>
      <button onClick={onBackToList} className={styles['quiz-not-found__button']}>
        {t('errors.goBack')}
      </button>
    </div>
  );
};

export default QuizNotFound;
