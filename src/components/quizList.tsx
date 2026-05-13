import { useMemo, useRef } from 'react';
import { useIndexDB } from './../hooks/useIndexDB';
import { readFileAsJSON } from './../helpers/fileUpload';
import type { Quiz } from './../types/quiz';

const QuizList = () => {
  const db = useIndexDB<Quiz>('quiz-stag-party', 'quiz-list');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quizList = useMemo(() => {
    if (!db) return [];
    return db.getAll();
  }, [db]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
          await db.add(quiz);
        }
      } else {
        // If file contains single quiz
        await db.add(result.data);
      }
      alert('Quiz(zes) added successfully!');
    } catch (error) {
      alert('Failed to add quiz(zes)');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (quizList.length === 0) {
    return (
      <div>
        <p>Brak dostępnych quizów.</p>
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
      <h2>Lista quizów</h2>
      <ul>
        {quizList.map((quiz) => (
          <li key={quiz.id}>
            {quiz.title}
            <button onClick={() => db.delete(quiz.id)} style={{ marginLeft: '10px' }}>
              Usuń
            </button>
            <button>Zagraj</button>
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
