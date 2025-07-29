import { Outlet } from "react-router-dom"
import Header from "../components/dashboard/Header"
import Navbar from "../components/dashboard/Navbar"

const Dashboard = () => {
  return (
    <main className="bg-accentXLight dark:bg-dark min-h-scren flex flex-col">
      <Header />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </main>
  )
}

export default Dashboard