const getCourseProgress = (completedWordsSize,  courseWordSize) => {
  const completedWords = courseWordSize === completedWordsSize ? completedWordsSize : completedWordsSize + 1;
  const progress = (completedWords / courseWordSize) * 100;

  return Math.round(progress.toFixed(1));
};

module.exports = {
  getCourseProgress
}
