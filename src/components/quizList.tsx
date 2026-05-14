import React, { useCallback, useMemo, useRef } from 'react';
import { useIndexDB } from '../hooks/useIndexDB';
import { readFileAsJSON } from '../helpers/fileUpload';
import type { Quiz } from '../types/quiz';
import { useNavigate } from '@tanstack/react-router';
import styles from '../styles/QuizList.module.css';

// Quiz item component
const QuizItem: React.FC<{
  quiz: Quiz;
  onPlay: (quizId: string) => void;
  onDelete: (quizId: string) => void;
}> = ({ quiz, onPlay, onDelete }) => (
  <li key={quiz.id} className={styles.quizItem}>
    <span className={styles.quizTitle}>{quiz.title}</span>
    <div className={styles.buttonGroup}>
      <button onClick={() => onPlay(quiz.id)} className={styles.playButton}>
        🎮 Graj
      </button>
      <button onClick={() => onDelete(quiz.id)} className={styles.deleteButton}>
        🗑️ Usuń
      </button>
    </div>
  </li>
);

QuizItem.displayName = 'QuizItem';

const QuizListComponent: React.FC = () => {
  const db = useIndexDB<Quiz>('quiz-stag-party', 'quiz-list');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const quizList = useMemo(() => {
    if (!db) return [];
    return db.getAll();
  }, [db]);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const result = await readFileAsJSON<Quiz>(file, {
        allowedTypes: ['application/json'],
        maxSize: 5 * 1024 * 1024, // 5MB
      });

      if (!result.success) {
        alert(`Error: ${result.message}`);
        return;
      }

      try {
        if (Array.isArray(result.data)) {
          // If file contains array of quizzes
          for (const quiz of result.data) {
            quiz['id'] = crypto.randomUUID(); // Assign unique ID to each quiz
            await db.add(quiz);
          }
        } else if (result.data) {
          // If file contains single quiz
          result.data['id'] = crypto.randomUUID(); // Assign unique ID to the quiz
          await db.add(result.data);
        } else {
          alert('No data found in file');
          return;
        }
        alert('Quiz(zes) added successfully!');
      } catch (error) {
        alert('Failed to add quiz(zes)');
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [db]
  );

  const triggerFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handlePlayQuiz = useCallback(
    (quizId: string) => {
      navigate({ to: '/$quizId', params: { quizId } });
    },
    [navigate]
  );

  const handleDeleteQuiz = useCallback(
    (quizId: string) => {
      db.delete(quizId);
    },
    [db]
  );

  if (quizList.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <p className={styles.emptyMessage}>Brak dostępnych quizów. Dodaj swój pierwszy quiz! ✨</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button onClick={triggerFileUpload} className={styles.addButton}>
          ➕ Dodaj quiz
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📋 Twoje Quizy</h2>
      <ul className={styles.quizList}>
        {quizList.map((quiz) => (
          <QuizItem key={quiz.id} quiz={quiz} onPlay={handlePlayQuiz} onDelete={handleDeleteQuiz} />
        ))}
      </ul>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      <button onClick={triggerFileUpload} className={styles.addButton}>
        ➕ Dodaj nowy quiz
      </button>
    </div>
  );
};

export default QuizListComponent;
