import { useTranslation } from 'react-i18next';
import styles from '../styles/LanguageSwitcher.module.css';

interface LanguageOption {
  code: string;
  flag: string;
  label: string;
}

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages: LanguageOption[] = [
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'pl', flag: '🇵🇱', label: 'Polski' },
  ];

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className={styles.languageSwitcher}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`${styles.flagButton} ${i18n.language === lang.code ? styles.active : ''}`}
          title={lang.label}
          type="button"
        >
          <span className={styles.flag}>{lang.flag}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
