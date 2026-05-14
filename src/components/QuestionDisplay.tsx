import React, { useCallback } from 'react';
import type { Question } from '../types/quiz';
import styles from './../styles/QuestionDisplay.module.css';

interface QuestionDisplayProps {
  question: Question;
  selectedAnswerId: string | undefined;
  isAnswerConfirmed: boolean;
  correctAnswerId: string;
  onSelectAnswer: (answerId: string) => void;
  eliminatedAnswers?: Set<string>;
}

interface AnswerItemProps {
  answerId: string;
  answerText: string;
  selectedAnswerId: string | undefined;
  isAnswerConfirmed: boolean;
  correctAnswerId: string;
  isEliminated: boolean;
  questionId: string;
  onSelectAnswer: (answerId: string) => void;
  className: string;
}

const AnswerItem: React.FC<AnswerItemProps> = ({
  answerId,
  answerText,
  selectedAnswerId,
  isAnswerConfirmed,
  correctAnswerId,
  isEliminated,
  questionId,
  onSelectAnswer,
  className,
}) => {
  const handleClick = useCallback(() => {
    if (!isAnswerConfirmed && !isEliminated) {
      onSelectAnswer(answerId);
    }
  }, [isAnswerConfirmed, isEliminated, onSelectAnswer, answerId]);

  const handleChange = useCallback(() => {
    if (!isAnswerConfirmed && !isEliminated) {
      onSelectAnswer(answerId);
    }
  }, [isAnswerConfirmed, isEliminated, onSelectAnswer, answerId]);

  return (
    <div key={answerId} className={className} onClick={handleClick}>
      <input
        type="radio"
        name={`question-${questionId}`}
        value={answerId}
        checked={selectedAnswerId === answerId}
        onChange={handleChange}
        className={styles['question-display__input']}
        disabled={isAnswerConfirmed || isEliminated}
      />
      <span className={styles['question-display__option-letter']}>{answerText}</span>
      {isEliminated && (
        <span
          className={`${styles['question-display__badge']} ${styles['question-display__badge--eliminated']}`}
        >
          ✕
        </span>
      )}
      {isAnswerConfirmed && answerId === correctAnswerId && (
        <span
          className={`${styles['question-display__badge']} ${styles['question-display__badge--correct']}`}
        >
          ✓ Correct
        </span>
      )}
      {isAnswerConfirmed && answerId === selectedAnswerId && answerId !== correctAnswerId && (
        <span
          className={`${styles['question-display__badge']} ${styles['question-display__badge--wrong']}`}
        >
          ✗ Wrong
        </span>
      )}
    </div>
  );
};

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedAnswerId,
  isAnswerConfirmed,
  correctAnswerId,
  onSelectAnswer,
  eliminatedAnswers = new Set(),
}) => {
  const getAnswerClasses = useCallback(
    (answerId: string): string => {
      const classes = [styles['question-display__answer']];

      if (eliminatedAnswers.has(answerId)) {
        classes.push(styles['question-display__answer--eliminated']);
        return classes.join(' ');
      }

      if (isAnswerConfirmed) {
        classes.push(styles['question-display__answer--confirmed']);
        if (answerId === correctAnswerId) {
          classes.push(styles['question-display__answer--correct']);
        } else if (selectedAnswerId === answerId) {
          classes.push(styles['question-display__answer--wrong']);
        } else {
          classes.push(styles['question-display__answer--default']);
          classes.push(styles['question-display__answer--disabled']);
        }
      } else {
        if (selectedAnswerId === answerId) {
          classes.push(styles['question-display__answer--selected']);
        } else {
          classes.push(styles['question-display__answer--default']);
        }
      }

      return classes.join(' ');
    },
    [eliminatedAnswers, isAnswerConfirmed, correctAnswerId, selectedAnswerId]
  );

  return (
    <div>
      <h3 className={styles['question-display__title']}>{question.text}</h3>

      <div className={styles['question-display__container']}>
        {question.answers.map((answer, index) => {
          const letter = String.fromCharCode(65 + index); // A, B, C, D, etc.
          return (
            <AnswerItem
              key={answer.id}
              answerId={answer.id}
              answerText={`${letter}) ${answer.text}`}
              selectedAnswerId={selectedAnswerId}
              isAnswerConfirmed={isAnswerConfirmed}
              correctAnswerId={correctAnswerId}
              isEliminated={eliminatedAnswers.has(answer.id)}
              questionId={question.id}
              onSelectAnswer={onSelectAnswer}
              className={getAnswerClasses(answer.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default QuestionDisplay;
