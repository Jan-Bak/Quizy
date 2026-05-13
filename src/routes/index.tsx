import { createFileRoute } from '@tanstack/react-router';
import QuizList from '../components/quizList';

const Index = () => {
  return (
    <div className="p-2">
      <h2>Cześć Mikołaj!</h2>
      <h3>Chetnyś do rozwiązania quizu?</h3>
      <QuizList />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: Index,
});
