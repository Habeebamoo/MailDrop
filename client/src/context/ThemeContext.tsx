import { useEffect, useState, createContext, useContext, type ReactNode } from "react"


type Theme = "light" | "dark"

type initThemeContext = {
  theme: Theme,
  setTheme: (t: Theme) => void
}

const ThemeContext = createContext<initThemeContext | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = JSON.parse(localStorage.getItem("maildrop-theme")!)
    return savedTheme ? savedTheme : "light"
  })

  useEffect(() => {
    localStorage.setItem("maildrop-theme", JSON.stringify(theme))
  }, [theme])

  useEffect(() => {
    if(theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if(!context) throw new Error("must be used inside a theme provider")
    
  return context
}