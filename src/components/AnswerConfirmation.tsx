import React from 'react';
import styles from './../styles/AnswerConfirmation.module.css';

interface AnswerConfirmationProps {
  isAnswerConfirmed: boolean;
  isCorrect: boolean | null;
  hasAnswerSelected: boolean;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
  onConfirm: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const AnswerConfirmationComponent: React.FC<AnswerConfirmationProps> = ({
  isAnswerConfirmed,
  isCorrect,
  hasAnswerSelected,
  canGoPrevious,
  isLastQuestion,
  onConfirm,
  onPrevious,
  onNext,
}) => {
  if (!isAnswerConfirmed) {
    return (
      <div className={styles['answer-confirmation__button-container']}>
        <button
          onClick={onConfirm}
          disabled={!hasAnswerSelected}
          className={styles['answer-confirmation__confirm-btn']}
        >
          Confirm Answer
        </button>
      </div>
    );
  }

  return (
    <div className={styles['answer-confirmation']}>
      <div
        className={`${styles['answer-confirmation__result']} ${
          isCorrect
            ? styles['answer-confirmation__result--correct']
            : styles['answer-confirmation__result--wrong']
        }`}
      >
        {isCorrect ? '🎉 Correct Answer!' : '❌ Wrong Answer!'}
      </div>
      <div className={styles['answer-confirmation__buttons']}>
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={styles['answer-confirmation__button']}
        >
          Previous
        </button>
        <button onClick={onNext} className={styles['answer-confirmation__button']}>
          {isLastQuestion ? 'View Results' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export const AnswerConfirmation: React.FC<AnswerConfirmationProps> = AnswerConfirmationComponent;
