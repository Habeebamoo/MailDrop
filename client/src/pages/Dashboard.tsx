import { Outlet, useNavigate } from "react-router-dom"
import Header from "../components/dashboard/Header"
import Navbar from "../components/dashboard/Navbar"
import Loading from "../components/dashboard/Loading"
import { useUser } from "../context/UserContext"
import { useEffect } from "react"

const Dashboard = () => {
  const { user, loading, fetchUser } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    fetchUser().then(() => {
      if (!user) {
        navigate("/login")
      }
    })
  }, [navigate, user, loading, fetchUser])

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