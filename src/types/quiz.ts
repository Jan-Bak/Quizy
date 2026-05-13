export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  correctAnswerId: string;
}

export interface Answer {
  id: string;
  text: string;
}
