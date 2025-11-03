import { Outlet, useNavigate } from "react-router-dom"
import Header from "../components/dashboard/Header"
import Navbar from "../components/dashboard/Navbar"
import Loading from "../components/dashboard/Loading"
import { useUser } from "../context/UserContext"
import { useEffect } from "react"
import Error from "../components/dashboard/Error"

const Dashboard = () => {
  const { user, loading } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login")
    }
  }, [navigate, user, loading])

  if (loading) return <Loading />

  if (!user) return <Error title="No User" text="Please log in to access your account" path="/login" pathText="Login" />

  return (
    <main className="bg-gray-100 dark:bg-dark min-h-scren flex flex-col">
      {!user && <Error />}
      <Header />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </main>
  )
}

export default Dashboard