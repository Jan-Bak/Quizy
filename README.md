# Quizy - Quiz Application

A simple and lightweight quiz application built with React, created for a stag party celebration! 🎉

## Features

- 📤 Upload quizzes from JSON files
- 💾 Store quizzes and results in IndexedDB
- 🔄 Persistent data - quizzes are saved locally
- ⏱️ Optional time limit per question
- 📊 Track scores and quiz history

## Implementation Checklist

### Already Done
- [x] **Project Setup** - initialized with Vite and TypeScript

### To Implement
- [ ] **JSON Upload** - form to upload quiz JSON files
- [ ] **IndexedDB Storage** - save quizzes and results locally
- [ ] **Quiz Logic** - display questions and verify answers
- [ ] **Timer** - optional countdown for each question
- [ ] **Results Screen** - show score summary and history
- [ ] **Styling** - responsive UI design
- [ ] **Validation** - verify JSON format before loading

## Quiz JSON Format

Quizzes should follow this structure:

```json
{
  "title": "My Quiz",
  "description": "Quiz description",
  "timePerQuestion": 30,
  "questions": [
    {
      "id": "q1",
      "text": "What is 2 + 2?",
      "type": "single",
      "options": [
        { "id": "a", "text": "3" },
        { "id": "b", "text": "4" },
        { "id": "c", "text": "5" }
      ],
      "correctAnswers": ["b"]
    },
    {
      "id": "q2",
      "text": "Which are programming languages? (select multiple)",
      "type": "multiple",
      "options": [
        { "id": "a", "text": "Python" },
        { "id": "b", "text": "HTML" },
        { "id": "c", "text": "JavaScript" }
      ],
      "correctAnswers": ["a", "c"]
    }
  ]
}
```

## Architecture

```
src/
├── components/
│   ├── QuizUpload.tsx       # Upload JSON quizzes
│   ├── QuizContainer.tsx    # Main quiz container
│   ├── QuestionCard.tsx     # Display question
│   ├── ResultsScreen.tsx    # Results summary
│   └── Timer.tsx            # Optional timer
├── hooks/
│   ├── useIndexedDB.ts      # IndexedDB operations
│   └── useQuizState.ts      # Quiz state management
├── utils/
│   ├── dbManager.ts         # IndexedDB manager
│   ├── quizValidator.ts     # JSON validation
│   └── calculateScore.ts    # Score calculation
├── types/
│   └── quiz.ts              # TypeScript types
├── App.tsx
└── index.css
```

## Installation & Setup

### Requirements
- Node.js 20+
- pnpm

### Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint
```

The app will be available at `http://localhost:5173`

## How to Use

1. **Prepare quiz** - create a JSON file in the format described above
2. **Upload** - click the Upload button and select your JSON file
3. **Answer questions** - click the correct option for each question
4. **Results** - view your score and performance
5. **History** - all quizzes and results are saved locally in IndexedDB

## IndexedDB Structure

All quizzes and results are stored locally in the browser's IndexedDB:

```
Database: QuizyDB
  Store: quizzes
    Key: quizId
    Data: { id, title, description, questions, createdAt }
  
  Store: results
    Key: resultId
    Data: { quizId, answers, score, totalQuestions, timestamp }
```

## Advanced Features

### Time Limit
Set `"timePerQuestion": 30` in your JSON to give 30 seconds per question. After time runs out, the quiz automatically moves to the next question.

### Question Types
- `"type": "single"` - single choice (one correct answer)
- `"type": "multiple"` - multiple choice (multiple correct answers)

## Tech Stack

- **React 19** - UI framework
- **Vite 8** - build tool
- **TypeScript** - type-safe JavaScript
- **IndexedDB** - local browser storage
- **CSS** - styling (no dependencies, pure CSS)

## License

MIT
