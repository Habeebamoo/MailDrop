import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"

type User = any

type initUserContext = {
  user: User
  loading: boolean
}

const UserContext = createContext<initUserContext | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>()
  const [loading, setLoading] = useState<boolean>(true)
  const navigate = useNavigate()

  useEffect(() => {
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
          navigate("/login")
          return
        }

        setUser(response)
      } catch (err) {
        navigate("/login")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <UserContext value={{ user, loading }}>
      {children}
    </UserContext>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error("must be used in a user provider")

  return context
}