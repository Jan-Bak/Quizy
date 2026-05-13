import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useIndexDB } from '../hooks/useIndexDB';
import { useQuizGame } from '../hooks/useQuizGame';
import { QuestionDisplay } from '../components/QuestionDisplay';
import { AnswerConfirmation } from '../components/AnswerConfirmation';
import { QuizResults } from '../components/QuizResults';
import { QuizNotFound } from '../components/QuizNotFound';
import { QuizProgress } from '../components/QuizProgress';
import type { Quiz } from '../types/quiz';
import { useMemo, useState } from 'react';
import styles from './../styles/$quizId.module.css';

const QuizIdRoute = () => {
  const { quizId } = Route.useParams();
  const navigate = useNavigate();
  const db = useIndexDB<Quiz>('quiz-stag-party', 'quiz-list');

  const selectedQuiz = useMemo(() => {
    if (!db) return null;
    return db.getById(quizId);
  }, [db, quizId]);

  // Create a default quiz to avoid undefined
  const quizForGame = selectedQuiz || {
    id: '',
    title: '',
    questions: [],
  };

  const game = useQuizGame(quizForGame);

  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);

  const handleConfirmAnswer = () => {
    setIsAnswerConfirmed(true);
  };

  const handleNextQuestion = () => {
    setIsAnswerConfirmed(false);
    game.nextQuestion();
  };

  if (!selectedQuiz) {
    return <QuizNotFound onBackToList={() => navigate({ to: '/' })} />;
  }

  // Quiz complete - show results
  if (game.isQuizComplete) {
    return (
      <QuizResults
        score={game.score}
        totalQuestions={game.totalQuestions}
        onRestart={game.restartQuiz}
        onBackToList={() => navigate({ to: '/' })}
      />
    );
  }

  // Quiz in progress
  const currentQ = game.currentQuestion;

  return (
    <div className={styles['quiz-container']}>
      <h1 className={styles['quiz-container__title']}>{selectedQuiz.title}</h1>
      <QuizProgress
        currentIndex={game.currentQuestionIndex}
        totalQuestions={game.totalQuestions}
        answeredCount={game.answeredQuestions}
        showAnsweredCount={!isAnswerConfirmed}
      />

      {currentQ && (
        <div>
          <QuestionDisplay
            question={currentQ}
            selectedAnswerId={game.getQuestionAnswer(currentQ.id)}
            isAnswerConfirmed={isAnswerConfirmed}
            correctAnswerId={currentQ.correctAnswerId}
            onSelectAnswer={(answerId) => game.selectAnswer(answerId)}
          />

          <AnswerConfirmation
            isAnswerConfirmed={isAnswerConfirmed}
            isCorrect={game.isCurrentAnswerCorrect}
            hasAnswerSelected={!!game.getQuestionAnswer(currentQ.id)}
            canGoPrevious={game.canGoPrevious}
            isLastQuestion={game.currentQuestionIndex === game.totalQuestions - 1}
            onConfirm={handleConfirmAnswer}
            onPrevious={game.previousQuestion}
            onNext={handleNextQuestion}
          />
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute('/$quizId')({
  component: QuizIdRoute,
});
