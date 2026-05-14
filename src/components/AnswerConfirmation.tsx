import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './../styles/AnswerConfirmation.module.css';

interface AnswerConfirmationProps {
  isAnswerConfirmed: boolean;
  hasAnswerSelected: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
  onConfirm: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const AnswerConfirmation: React.FC<AnswerConfirmationProps> = ({
  isAnswerConfirmed,
  hasAnswerSelected,
  canGoPrevious,
  isLastQuestion,
  onConfirm,
  onPrevious,
  onNext,
}) => {
  const { t } = useTranslation();

  if (!isAnswerConfirmed) {
    return (
      <div className={styles['answer-confirmation__button-container']}>
        <button
          onClick={onConfirm}
          disabled={!hasAnswerSelected}
          className={styles['answer-confirmation__confirm-btn']}
        >
          {t('quiz.confirmAnswer')}
        </button>
      </div>
    );
  }

  return (
    <div className={styles['answer-confirmation']}>
      <div className={styles['answer-confirmation__buttons']}>
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={styles['answer-confirmation__button']}
        >
          {t('quiz.previous')}
        </button>
        <button onClick={onNext} className={styles['answer-confirmation__button']}>
          {isLastQuestion ? t('quiz.viewResults') : t('quiz.nextQuestion')}
        </button>
      </div>
    </div>
  );
};

export default AnswerConfirmation;
