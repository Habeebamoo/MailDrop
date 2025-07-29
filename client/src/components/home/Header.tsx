import logo from "../../assets/logo.png"
import { RiMenu3Line } from "react-icons/ri"
import { LiaTimesSolid } from "react-icons/lia"
import NavBar from "./NavBar"
import { useState } from "react"

const Header = () => {
  const [navShown, setNavShown] = useState<boolean>(false)

  const toggleNav = () => {
    setNavShown(!navShown)
  }

  const menuIcon = navShown ? <LiaTimesSolid size={20} /> : <RiMenu3Line size={20} />

  return (
    <header className="p-3 fixed top-0 left-0 right-0">
      <nav className="bg-white rounded-md p-3 border-1 border-accentLight">
        <div className="flex-between">
          <div className="flex-start">
            <img src={logo} alt="Logo" className="h-[30px]" />
            <h1 className="text-xl font-outfit ml-1">MailDrop</h1>
          </div>
          <div className="flex-between gap-2 max-sm:hidden">
            <p className="text-lg text-primary font-inter cursor-pointer">Home</p>
            <p className="text-lg text-primary font-inter cursor-pointer">About</p>
          </div>
          <button className="max-sm:hidden btn-primary">Get Started</button>
          <div onClick={toggleNav} className="sm:hidden cursor-pointer">
            {menuIcon}
          </div>
        </div>
        {navShown && <NavBar />}
      </nav>
    </header>
  )
}

export default Header