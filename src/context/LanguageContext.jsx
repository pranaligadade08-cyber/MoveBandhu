import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../translations";
const LanguageContext = createContext(void 0);
export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem("movebandhu_lang") || localStorage.getItem("movemate_lang");
    if (saved === "mr" || saved === "hi" || saved === "en") {
      return saved;
    }
    return "en";
  });
  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem("movebandhu_lang", lang);
    document.documentElement.lang = lang;
  };
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  const value = {
    language,
    setLanguage,
    t: translations[language]
  };
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
