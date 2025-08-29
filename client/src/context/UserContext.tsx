import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type User = {
  userId: string,
  name: string,
  email: string,
  password: string,
  verified: boolean,
  profile: {
    userId: string,
    profilePic: string,
    bio: string,
    totalCampaigns: number,
    totalSubscribers: number,
    totalClicks: number,
    totalEmails: number,
  }
}

type initUserContext = {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<initUserContext | undefined>(undefined)

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let mounted = true;

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

        const response: User = await res.json()

        if (!res.ok) {
          if (mounted) setUser(null)
          return
        } else {
          if (mounted) setUser(response)
        }
      } catch (err) {
        if (mounted) setUser(null)
        throw new Error("something went wrong")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchUser()

    return () => {
      mounted = false;
    }
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