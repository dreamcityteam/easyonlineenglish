type Item = {
  _id: string;
  audioUrl: string;
  englishWord: string;
  imageUrl: string;
  spanishTranslation: string;
  verb?: string;
  englishWordConjugation?: boolean;
  spanishTranslationConjugation?: string[];
  avoidPronouns?: string[];
  apostrophe?: boolean;
};

type EnglishVerbConjugation = {
  item: Item;
  lang?: 'es' | 'en';
  text?: string;
};

export type {
  Item,
  EnglishVerbConjugation
};
