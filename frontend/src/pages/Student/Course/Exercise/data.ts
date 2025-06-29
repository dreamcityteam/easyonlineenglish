interface TTiming {
  [key: string]: {
    timing: [number, string][];
    timingEnd: [number, number];
  }
}

const songTimings: TTiming = {
  alphabet: {
    timing: [
      [0, 'a'], [0.4, 'b'], [1, 'c'], [1.4, 'd'], [2, 'e'], [2.4, 'f'],
      [3, 'g'], [4, 'h'], [4.4, 'i'], [5, 'j'], [5.4, 'k'], [6, 'l'],
      [6.4, 'm'], [6.6, 'n'], [6.8, 'o'], [7, 'p'], [8, 'q'], [8.4, 'r'],
      [9, 's'], [10, 't'], [10.4, 'u'], [11, 'v'], [11.8, 'w'], [12.8, 'x'],
      [13.8, 'y'], [15, 'z'], [18, 'a'], [18.4, 'b'], [19, 'c']
    ],

    timingEnd: [17.8, 24.1]
  }
};

export {
  songTimings
};
