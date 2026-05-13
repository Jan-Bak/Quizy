import { createFileRoute } from '@tanstack/react-router';
import QuizList from './../components/QuizList';
import styles from '../styles/index.module.css';

const Index = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.greeting}>{import.meta.env.VITE_GREETING ?? 'Hi! 👋'}</h2>
        <h3 className={styles.subheading}>
          {import.meta.env.VITE_SUBHEADING ?? 'Ready to solve a quiz?'}
        </h3>
      </div>
      <QuizList />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: Index,
});
