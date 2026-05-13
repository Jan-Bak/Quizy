import { useCallback, useMemo, useRef } from 'react';
import { useIndexDB } from './../hooks/useIndexDB';
import { readFileAsJSON } from './../helpers/fileUpload';
import type { Quiz } from './../types/quiz';
import { useNavigate } from '@tanstack/react-router';

const QuizList = () => {
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

  if (quizList.length === 0) {
    return (
      <div>
        <p>No available quizzes.</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button onClick={triggerFileUpload}>Dodaj quiz</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Quiz list</h2>
      <ul>
        {quizList.map((quiz) => (
          <li key={quiz.id}>
            {quiz.title}
            <button onClick={() => db.delete(quiz.id)} style={{ marginLeft: '10px' }}>
              Delete
            </button>
            <button
              onClick={() => navigate({ to: '/$quizId', params: { quizId: quiz.id } })}
              style={{ marginLeft: '10px' }}
            >
              Play
            </button>
          </li>
        ))}
      </ul>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      <button onClick={triggerFileUpload}>Dodaj quiz</button>
    </div>
  );
};

export default QuizList;
