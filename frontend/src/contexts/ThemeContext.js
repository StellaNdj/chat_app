import { createContext, useState } from "react";

export const ThemeContext = createContext();

const ThemeProvider = ({children}) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.className = darkMode ? 'light-theme' : 'dark-theme';
  }
  return(
    <ThemeContext.Provider value={{darkMode, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider;
