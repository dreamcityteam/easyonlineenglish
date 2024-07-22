type Item = {
  _id: string;
  audioUrl: string;
  englishWord: string;
  imageUrl: string;
  spanishTranslation: string;
  verb?: string[];
  englishWordConjugation?: boolean;
  spanishTranslationConjugation?: string[];
};

type EnglishVerbConjugation = {
  item: Item;
  lang?: 'es' | 'en';
  text?: string;
  avoidSpanishPronouns?: boolean
};

export type {
  Item,
  EnglishVerbConjugation
};
