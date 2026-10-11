import { createContext, useContext, useState, useEffect } from "react";

export const THEMES = {
  GOLD_PINK_WHITE: "gold-pink-white",
  DARK: "dark"
};

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem("movebandhu_theme");
    return saved === THEMES.DARK ? THEMES.DARK : THEMES.GOLD_PINK_WHITE;
  });

  useEffect(() => {
    localStorage.setItem("movebandhu_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === THEMES.DARK) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === THEMES.DARK ? THEMES.GOLD_PINK_WHITE : THEMES.DARK));
  };

  const setTheme = (newTheme) => {
    if (newTheme === THEMES.DARK || newTheme === THEMES.GOLD_PINK_WHITE) {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === THEMES.DARK,
        isGoldPinkWhite: theme === THEMES.GOLD_PINK_WHITE
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
