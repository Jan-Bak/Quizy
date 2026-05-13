import { createFileRoute, Link } from '@tanstack/react-router';
import { useIndexDB } from '../hooks/useIndexDB';
import type { Quiz } from '../types/quiz';
import { useMemo } from 'react';

const QuizIdRoute = () => {
  const { quizId } = Route.useParams();
  const db = useIndexDB<Quiz>('quiz-stag-party', 'quiz-list');

  const selectedQuiz = useMemo(() => {
    if (!db) return null;
    return db.getById(quizId);
  }, [db, quizId]);

  if (!selectedQuiz) {
    return (
      <div>
        Quiz not found <Link to="/">Go back</Link>
      </div>
    );
  }

  return <div>Hello {quizId}!</div>;
};

export const Route = createFileRoute('/$quizId')({
  component: QuizIdRoute,
});
