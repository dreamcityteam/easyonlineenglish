import React, { useEffect, useState } from 'react';
import style from './style.module.sass';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const LanguageSwitcher: React.FC = (): JSX.Element => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>({
    code: 'es',
    name: 'Español',
    flag: '🇪🇸'
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const languages: Language[] = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' }
  ];

  useEffect(() => {
    // Detectar idioma actual de Weglot
    const detectCurrentLanguage = () => {
      const path = window.location.pathname;
      if (path.startsWith('/en')) {
        setCurrentLanguage(languages[1]);
      } else if (path.startsWith('/fr')) {
        setCurrentLanguage(languages[2]);
      } else {
        setCurrentLanguage(languages[0]);
      }
    };

    detectCurrentLanguage();
  }, []);

  const handleLanguageChange = (language: Language) => {
    // @ts-ignore
    if (window.Weglot) {
      // @ts-ignore
      window.Weglot.switchTo(language.code);
    }
    setCurrentLanguage(language);
    setIsOpen(false);
  };

  return (
    <div className={style.languageSwitcher}>
      <button 
        className={style.languageSwitcher__button}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Cambiar idioma"
      >
        <span className={style.languageSwitcher__flag}>
          {currentLanguage.flag}
        </span>
        <span className={style.languageSwitcher__name}>
          {currentLanguage.name}
        </span>
        <span className={style.languageSwitcher__arrow}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>
      
      {isOpen && (
        <div className={style.languageSwitcher__dropdown}>
          {languages.map((language) => (
            <button
              key={language.code}
              className={`${style.languageSwitcher__option} ${
                currentLanguage.code === language.code ? style.languageSwitcher__option_active : ''
              }`}
              onClick={() => handleLanguageChange(language)}
            >
              <span className={style.languageSwitcher__optionFlag}>
                {language.flag}
              </span>
              <span className={style.languageSwitcher__optionName}>
                {language.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
