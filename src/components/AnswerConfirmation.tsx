import React from 'react';
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

export default AnswerConfirmation;
