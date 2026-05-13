import { useState, useCallback, useMemo } from 'react';
import type { Quiz, Question } from '../types/quiz';

interface UserAnswer {
  questionId: string;
  selectedAnswerId: string;
}

interface UseQuizGameReturn {
  quiz: Quiz;
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  totalQuestions: number;
  userAnswers: UserAnswer[];
  isQuizComplete: boolean;
  score: number;
  answeredQuestions: number;
  selectAnswer: (answerId: string) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  getQuestionAnswer: (questionId: string) => string | undefined;
  isCurrentAnswerCorrect: boolean | null;
  restartQuiz: () => void;
}

/**
 * Hook to manage quiz game state
 * @param quiz - The quiz to play
 * @returns Quiz game state and methods
 */
export function useQuizGame(quiz: Quiz): UseQuizGameReturn {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  // Get current question
  const currentQuestion = useMemo(() => {
    if (currentQuestionIndex < quiz.questions.length) {
      return quiz.questions[currentQuestionIndex];
    }
    return null;
  }, [quiz.questions, currentQuestionIndex]);

  // Check if quiz is complete
  const isQuizComplete = useMemo(() => {
    return currentQuestionIndex >= quiz.questions.length;
  }, [currentQuestionIndex, quiz.questions.length]);

  // Calculate score
  const score = useMemo(() => {
    return userAnswers.reduce((acc, answer) => {
      const question = quiz.questions.find((q) => q.id === answer.questionId);
      if (question && question.correctAnswerId === answer.selectedAnswerId) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [userAnswers, quiz.questions]);

  // Get user's answer for a specific question
  const getQuestionAnswer = useCallback(
    (questionId: string): string | undefined => {
      return userAnswers.find((a) => a.questionId === questionId)?.selectedAnswerId;
    },
    [userAnswers]
  );

  // Check if current answer is correct
  const isCurrentAnswerCorrect = useMemo(() => {
    if (!currentQuestion) return null;
    const userAnswer = getQuestionAnswer(currentQuestion.id);
    if (!userAnswer) return null;
    return currentQuestion.correctAnswerId === userAnswer;
  }, [currentQuestion, getQuestionAnswer]);

  // Select answer for current question
  const selectAnswer = useCallback(
    (answerId: string) => {
      if (!currentQuestion) return;

      setUserAnswers((prev) => {
        const existing = prev.findIndex((a) => a.questionId === currentQuestion.id);
        if (existing !== -1) {
          // Update existing answer
          const updated = [...prev];
          updated[existing].selectedAnswerId = answerId;
          return updated;
        }
        // Add new answer
        return [
          ...prev,
          {
            questionId: currentQuestion.id,
            selectedAnswerId: answerId,
          },
        ];
      });
    },
    [currentQuestion]
  );

  // Move to next question
  const nextQuestion = useCallback(() => {
    if (!isQuizComplete) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [isQuizComplete]);

  // Move to previous question
  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  // Restart quiz
  const restartQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
  }, []);

  return {
    quiz,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: quiz.questions.length,
    userAnswers,
    isQuizComplete,
    score,
    answeredQuestions: userAnswers.length,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    canGoNext: !isQuizComplete && userAnswers.some((a) => a.questionId === currentQuestion?.id),
    canGoPrevious: currentQuestionIndex > 0,
    getQuestionAnswer,
    isCurrentAnswerCorrect,
    restartQuiz,
  };
}
