import logo from "../../assets/logo.png"
import { RiMenu3Line } from "react-icons/ri"
import { LiaTimesSolid } from "react-icons/lia"
import NavBar from "./NavBar"
import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useUser } from "../../context/UserContext"

const Header = () => {
  const [navShown, setNavShown] = useState<boolean>(false)
  const { user } = useUser()
  const navigate = useNavigate()

  const toggleNav = () => {
    setNavShown(!navShown)
  }

  const menuIcon = navShown ? <LiaTimesSolid size={20} /> : <RiMenu3Line size={20} />
  const autoSignInText = user ? "Dashboard" : "Login"

  const autoSignIn = () => {
    if (user) {
      navigate("/dashboard/home")
    } else {
      navigate("/login")
    }
  }

  return (
    <header className="pt-3 px-3 fixed top-0 left-0 right-0 z-10">
      <nav className="bg-white p-3 md:p-4 px-6 md:px-8 rounded-full border-1 border-gray-200 md:w-[90%] mx-auto">
        <div className="flex-between">
          <div className="flex-start">
            <img src={logo} alt="Logo" className="h-[30px]" />
            <h1 className="text-xl font-inter text-primary ml-1">MailDrop</h1>
          </div>
          <div className="flex-between gap-4 max-sm:hidden ">
            <NavLink 
              to={"/"} 
              className={({ isActive }) => isActive ? "home-dsk-link-active" : "home-dsk-link"}
            >
              Home
            </NavLink>
            <NavLink
              to={"/about"}
              className={({ isActive }) => isActive ? "home-dsk-link-active" : "home-dsk-link"}
            >
              About
            </NavLink>
            <NavLink 
              to={"/pricing"} 
              className={({ isActive }) => isActive ? "home-dsk-link-active" : "home-dsk-link"}
            >
              Pricing
            </NavLink>
            <NavLink 
              to={"/contact"} 
              className={({ isActive }) => isActive ? "home-dsk-link-active" : "home-dsk-link"}
            >
              Contact
            </NavLink>          
          </div>

          <button 
            onClick={autoSignIn} 
            className="max-sm:hidden font-jsans rounded-full px-6 py-2 btn-primary"
          >
            {autoSignInText}
          </button>

          <div onClick={toggleNav} className="sm:hidden cursor-pointer">
            {menuIcon}
          </div>
        </div>

        {navShown && <NavBar setNavShown={setNavShown} />}
      </nav>
    </header>
  )
}

export default Header