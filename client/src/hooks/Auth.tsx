import { useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext"
import { useEffect } from "react"

export const useRequireUser = () => {
  const { user, loading } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      console.log("user not found")
      navigate("/login")
    }
  }, [loading, user, navigate])

  return { user, loading }
}