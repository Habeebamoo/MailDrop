import { Outlet, useNavigate } from "react-router-dom"
import Header from "../components/dashboard/Header"
import Navbar from "../components/dashboard/Navbar"
import Loading from "../components/dashboard/Loading"
import { useUser } from "../context/UserContext"
import { useEffect } from "react"

const Dashboard = () => {
  const { user, loading } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login")
    }
  }, [navigate, user, loading])

  console.log(user)

  return (
    <main className="bg-accentXLight dark:bg-dark min-h-scren flex flex-col">
      {loading && <Loading />}
      <Header />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </main>
  )
}

export default Dashboard