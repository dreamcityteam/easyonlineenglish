import { Word } from "../../../global/state/type";

type OnWord = {
  word: Word;
  indexLesson: number;
  wordIndex: number;
  canTakeNextWord?: boolean;
};

type CourseProgress = {
  idStudentCourse: string;
  completedWords: string;
  unlockedWords: string;
  index: { lesson: number; word: number; sentence: number; };
  progress: number;
};

type AudioWordProps = {
  type: 'englishWord' | 'letter';
};

type WordSplitType = {
  hasQuotes?: boolean;
  isHighlights?: boolean;
  text: string;
  url: string;
};

export type {
  OnWord,
  CourseProgress,
  AudioWordProps,
  WordSplitType
}
