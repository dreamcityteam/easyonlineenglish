const getCourseProgress = (completedWordsSize: number,  courseWordSize: number): number => {
  const completedWords = courseWordSize === completedWordsSize ? completedWordsSize : completedWordsSize + 1;
  const progress: any = (completedWords / courseWordSize) * 100;

  return Math.round(progress.toFixed(1));
};

export {
  getCourseProgress
};
