import { NavLink, useNavigate } from "react-router-dom"
import { useUser } from "../../context/UserContext"

const NavBar = () => {
  const { user } = useUser()
  const navigate = useNavigate()

  const autoSignInText = user ? "Dashboard" : "Login"

  const autoSignIn = () => {
    if (user) {
      navigate("/dashboard/home")
    } else {
      navigate("/login")
    }
  }

  return (
    <div className="flex-center flex-col mt-3 sm:hidden">
      <NavLink 
        to={"/"} 
        className={({ isActive }) => isActive ? "home-mobile-link-active" : "home-mobile-link"}
      >
        Home
      </NavLink>
      <NavLink
        to={"/about"}
        className={({ isActive }) => isActive ? "home-mobile-link-active" : "home-mobile-link"}
      >
        About
      </NavLink>
      <NavLink 
        to={"/pricing"} 
        className={({ isActive }) => isActive ? "home-mobile-link-active" : "home-mobile-link"}
      >
        Pricing
      </NavLink>
      <NavLink 
        to={"/contact"} 
        className={({ isActive }) => isActive ? "home-mobile-link-active" : "home-mobile-link"}
      >
        Contact
      </NavLink>
      <button onClick={autoSignIn} className="max-sm:px-3 max-sm:py-2 btn-primary mt-1">{autoSignInText}</button>
    </div>
  )
}

export default NavBar