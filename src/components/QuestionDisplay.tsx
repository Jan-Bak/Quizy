import React from 'react';
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

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedAnswerId,
  isAnswerConfirmed,
  correctAnswerId,
  onSelectAnswer,
  eliminatedAnswers = new Set(),
}) => {
  const getAnswerClasses = (answerId: string): string => {
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
  };

  return (
    <div>
      <h3 className={styles['question-display__title']}>{question.text}</h3>

      <div className={styles['question-display__container']}>
        {question.answers.map((answer) => (
          <div
            key={answer.id}
            className={getAnswerClasses(answer.id)}
            onClick={() =>
              !isAnswerConfirmed && !eliminatedAnswers.has(answer.id) && onSelectAnswer(answer.id)
            }
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={answer.id}
              checked={selectedAnswerId === answer.id}
              onChange={() =>
                !isAnswerConfirmed && !eliminatedAnswers.has(answer.id) && onSelectAnswer(answer.id)
              }
              className={styles['question-display__input']}
              disabled={isAnswerConfirmed || eliminatedAnswers.has(answer.id)}
            />
            {answer.text}
            {eliminatedAnswers.has(answer.id) && (
              <span
                className={`${styles['question-display__badge']} ${styles['question-display__badge--eliminated']}`}
              >
                ✕
              </span>
            )}
            {isAnswerConfirmed && answer.id === correctAnswerId && (
              <span
                className={`${styles['question-display__badge']} ${styles['question-display__badge--correct']}`}
              >
                ✓ Correct
              </span>
            )}
            {isAnswerConfirmed &&
              answer.id === selectedAnswerId &&
              answer.id !== correctAnswerId && (
                <span
                  className={`${styles['question-display__badge']} ${styles['question-display__badge--wrong']}`}
                >
                  ✗ Wrong
                </span>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};
