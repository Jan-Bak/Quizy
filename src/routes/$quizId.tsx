import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useMemo, useState, useCallback } from 'react';
import { useIndexDB } from '../hooks/useIndexDB';
import { useQuizGame } from '../hooks/useQuizGame';
import { QuestionDisplay } from '../components/QuestionDisplay';
import { QuizResults } from '../components/QuizResults';
import { QuizNotFound } from '../components/QuizNotFound';
import { QuizProgress } from '../components/QuizProgress';
import { Lifelines } from '../components/Lifelines';
import type { Quiz } from '../types/quiz';
import styles from './../styles/$quizId.module.css';
import AnswerConfirmation from '../components/AnswerConfirmation';

const QuizIdRoute: React.FC = () => {
  const { quizId } = Route.useParams();
  const navigate = useNavigate();
  const db = useIndexDB<Quiz>('quiz-stag-party', 'quiz-list');

  const selectedQuiz = useMemo(() => {
    if (!db) return undefined;
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

  const handleConfirmAnswer = useCallback(() => {
    setIsAnswerConfirmed(true);
  }, []);

  const handleNextQuestion = useCallback(() => {
    setIsAnswerConfirmed(false);
    game.nextQuestion();
  }, [game.nextQuestion]);

  const handleSelectAnswer = useCallback(
    (answerId: string) => {
      game.selectAnswer(answerId);
    },
    [game.selectAnswer]
  );

  const handleBackToList = useCallback(() => {
    navigate({ to: '/' });
  }, [navigate]);

  if (!selectedQuiz) {
    return <QuizNotFound onBackToList={handleBackToList} />;
  }

  // Quiz complete - show results
  if (game.isQuizComplete) {
    return (
      <QuizResults
        score={game.score}
        totalQuestions={game.totalQuestions}
        onRestart={game.restartQuiz}
        onBackToList={handleBackToList}
      />
    );
  }

  // Quiz in progress
  const currentQ = game.currentQuestion;

  return (
    <div className={styles.quizContainer}>
      <div className={styles.quizHeader}>
        <h1 className={styles.quizTitle}>{selectedQuiz.title}</h1>
      </div>

      <div className={styles.progressAndLifelines}>
        <QuizProgress
          currentIndex={game.currentQuestionIndex}
          totalQuestions={game.totalQuestions}
        />
        <Lifelines
          usedLifelines={game.usedLifelines}
          onUse50_50={game.use50_50}
          onUseCallToFriend={game.useCallToFriend}
          onUsePublicVote={game.usePublicVote}
          isAnswerConfirmed={isAnswerConfirmed}
        />
      </div>

      {currentQ && (
        <div className={styles.quizContent}>
          <QuestionDisplay
            question={currentQ}
            selectedAnswerId={game.getQuestionAnswer(currentQ.id)}
            isAnswerConfirmed={isAnswerConfirmed}
            correctAnswerId={currentQ.correctAnswerId}
            onSelectAnswer={handleSelectAnswer}
            eliminatedAnswers={game.eliminatedAnswers}
          />

          <AnswerConfirmation
            isAnswerConfirmed={isAnswerConfirmed}
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
