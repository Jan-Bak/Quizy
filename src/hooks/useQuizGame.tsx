import { useState, useCallback, useMemo } from 'react';
import type { Quiz, Question, LifelineType } from '../types/quiz';

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
  usedLifelines: Record<LifelineType, boolean>;
  eliminatedAnswers: Set<string>;
  use50_50: () => void;
  useCallToFriend: () => void;
  usePublicVote: () => void;
  canUseLifeline: (lifelineType: LifelineType) => boolean;
}

// Fisher-Yates shuffle algorithm for better performance
const shuffleArray = <T,>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Hook to manage quiz game state
 * @param quiz - The quiz to play
 * @returns Quiz game state and methods
 */
export function useQuizGame(quiz: Quiz): UseQuizGameReturn {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Use Map for O(1) lookup instead of array with find
  const [userAnswersMap, setUserAnswersMap] = useState<Map<string, string>>(new Map());
  const [usedLifelines, setUsedLifelines] = useState<Record<LifelineType, boolean>>({
    '50/50': false,
    callToFriend: false,
    publicVote: false,
  });
  const [eliminatedAnswers, setEliminatedAnswers] = useState<Set<string>>(new Set());

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

  // Calculate score - cache it instead of recalculating every render
  const score = useMemo(() => {
    let correctCount = 0;
    userAnswersMap.forEach((selectedId, questionId) => {
      const question = quiz.questions.find((q) => q.id === questionId);
      if (question && question.correctAnswerId === selectedId) {
        correctCount++;
      }
    });
    return correctCount;
  }, [userAnswersMap, quiz.questions]);

  // Get user's answer for a specific question - O(1) with Map instead of O(n) with find
  const getQuestionAnswer = useCallback(
    (questionId: string): string | undefined => {
      return userAnswersMap.get(questionId);
    },
    [userAnswersMap]
  );

  // Check if current answer is correct
  const isCurrentAnswerCorrect = useMemo(() => {
    if (!currentQuestion) return null;
    const userAnswer = getQuestionAnswer(currentQuestion.id);
    if (!userAnswer) return null;
    return currentQuestion.correctAnswerId === userAnswer;
  }, [currentQuestion, getQuestionAnswer]);

  // Check if can go to next question (memoized for performance)
  const canGoNextMemoized = useMemo(
    () => !isQuizComplete && userAnswersMap.has(currentQuestion?.id ?? ''),
    [isQuizComplete, userAnswersMap, currentQuestion?.id]
  );

  // Select answer for current question
  const selectAnswer = useCallback(
    (answerId: string) => {
      if (!currentQuestion) return;

      setUserAnswersMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(currentQuestion.id, answerId);
        return newMap;
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
    setUserAnswersMap(new Map());
    setUsedLifelines({
      '50/50': false,
      callToFriend: false,
      publicVote: false,
    });
    setEliminatedAnswers(new Set());
  }, []);

  // Check if lifeline can be used
  const canUseLifeline = useCallback(
    (lifelineType: LifelineType): boolean => {
      return !usedLifelines[lifelineType];
    },
    [usedLifelines]
  );

  // Use 50/50 lifeline - eliminates 2 wrong answers
  const use50_50 = useCallback(() => {
    if (!currentQuestion || usedLifelines['50/50']) return;

    const wrongAnswers = currentQuestion.answers.filter(
      (a) => a.id !== currentQuestion.correctAnswerId
    );

    if (wrongAnswers.length < 2) return;

    // Use Fisher-Yates shuffle for better performance
    const shuffled = shuffleArray(wrongAnswers);
    const toEliminate = shuffled.slice(0, 2).map((a) => a.id);

    setEliminatedAnswers(new Set(toEliminate));
    setUsedLifelines((prev) => ({
      ...prev,
      '50/50': true,
    }));
  }, [currentQuestion, usedLifelines]);

  // Use call to friend lifeline (symbolic - just marks as used)
  const useCallToFriend = useCallback(() => {
    if (usedLifelines['callToFriend']) return;

    setUsedLifelines((prev) => ({
      ...prev,
      callToFriend: true,
    }));
  }, [usedLifelines]);

  // Use public vote lifeline (symbolic - just marks as used)
  const usePublicVote = useCallback(() => {
    if (usedLifelines['publicVote']) return;

    setUsedLifelines((prev) => ({
      ...prev,
      publicVote: true,
    }));
  }, [usedLifelines]);

  return {
    quiz,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions: quiz.questions.length,
    userAnswers: Array.from(userAnswersMap, ([questionId, selectedAnswerId]) => ({
      questionId,
      selectedAnswerId,
    })),
    isQuizComplete,
    score,
    answeredQuestions: userAnswersMap.size,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    canGoNext: canGoNextMemoized,
    canGoPrevious: currentQuestionIndex > 0,
    getQuestionAnswer,
    isCurrentAnswerCorrect,
    restartQuiz,
    usedLifelines,
    eliminatedAnswers,
    use50_50,
    useCallToFriend,
    usePublicVote,
    canUseLifeline,
  };
}
