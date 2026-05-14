import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import QuizList from './../components/QuizList';
import styles from '../styles/index.module.css';

const Index = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.greeting}>{import.meta.env.VITE_GREETING ?? t('home.greeting')}</h2>
        <h3 className={styles.subheading}>
          {import.meta.env.VITE_SUBHEADING ?? t('home.subheading')}
        </h3>
      </div>
      <QuizList />
    </div>
  );
};

export const Route = createFileRoute('/')({
  component: Index,
});
