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
  index: { lesson: number; word: number; sentence?: string };
  progress: number;
};

export type {
  OnWord,
  CourseProgress
}
