import { Outlet } from "react-router-dom"
import Header from "../components/dashboard/Header"
import Navbar from "../components/dashboard/Navbar"

const Dashboard = () => {
  return (
    <main className="bg-accentXLight">
      <Header />
      <Navbar />
      <Outlet />
    </main>
  )
}

export default Dashboard