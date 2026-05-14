import { createFileRoute, useNavigate } from '@tanstack/react-router';
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useIndexDB } from '../hooks/useIndexDB';
import { useQuizGame } from '../hooks/useQuizGame';

import type { Quiz } from '../types/quiz';
import styles from './../styles/$quizId.module.css';
import AnswerConfirmation from '../components/AnswerConfirmation';
import QuizResults from '../components/QuizResults';
import Lifelines from '../components/Lifelines';
import QuestionDisplay from '../components/QuestionDisplay';
import QuizNotFound from '../components/QuizNotFound';
import QuizProgress from '../components/QuizProgress';

const QuizIdRoute: React.FC = () => {
  const { quizId } = Route.useParams();
  const navigate = useNavigate();
  const db = useIndexDB<Quiz>('quiz-stag-party', 'quiz-list');

  const selectedQuiz = useMemo(() => {
    if (!db) return undefined;
    return db.getById(quizId);
  }, [db, quizId]);

  // Set page title based on quiz or .env
  useEffect(() => {
    if (selectedQuiz) {
      const pageTitle = import.meta.env.VITE_TITLE || selectedQuiz.title;
      document.title = pageTitle;
    }
  }, [selectedQuiz]);

  // Create a default quiz to avoid undefined
  const quizForGame = selectedQuiz || {
    id: '',
    title: '',
    questions: [],
  };

  const game = useQuizGame(quizForGame);

  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset isAnswerConfirmed and show transition animation when moving to next question
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsAnswerConfirmed(false);
      setIsTransitioning(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [game.currentQuestionIndex]);

  const handleConfirmAnswer = useCallback(() => {
    setIsAnswerConfirmed(true);
  }, []);

  const handleNextQuestion = useCallback(() => {
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
          {isTransitioning ? (
            <div className={styles.transitionLoading}>
              <div className={styles.confettiContainer}>
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className={styles.confetti}></div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <QuestionDisplay
                key={currentQ.id}
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute('/$quizId')({
  component: QuizIdRoute,
});
