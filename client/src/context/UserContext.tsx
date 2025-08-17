import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type User = any

type initUserContext = {
  user: User
  loading: boolean,
  fetchUser: () => Promise<void>
}

const UserContext = createContext<initUserContext | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>()
  const [loading, setLoading] = useState<boolean>(true)

  const fetchUser = async () => {
    try {
      const res = await fetch("https://maildrop-znoo.onrender.com/api/user/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        }
      })

      const response = await res.json()

      if (!res.ok) {
        setUser(null)
        return
      }

      setUser(response)
    } catch (err) {
      setUser(null)
      throw new Error("something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <UserContext value={{ user, loading, fetchUser }}>
      {children}
    </UserContext>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error("must be used in a user provider")

  return context
}