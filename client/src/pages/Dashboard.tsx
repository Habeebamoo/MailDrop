import { Outlet } from "react-router-dom"
import Header from "../components/dashboard/Header"
import { useState } from "react"
import Navbar from "../components/dashboard/Navbar"

const Dashboard = () => {
  const [navActive, setNavActive] = useState<boolean>(false)

  return (
    <main className="bg-accentXLight">
      <Header />
      <Navbar />
      <Outlet />
    </main>
  )
}

export default Dashboard