import { NavLink, useNavigate } from "react-router-dom"
import { useUser } from "../../context/UserContext"
import { MdCancel } from "react-icons/md"
import { motion } from "framer-motion"
import { navVariant } from "../../utils/animation"

interface Props {
  setNavShown: React.Dispatch<React.SetStateAction<boolean>>
}

const NavBar = ({ setNavShown }: Props) => {
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
    <div className="fixed top-0 left-0 right-0 bottom-0 z-20 bg-black/80 sm:hidden">
      <motion.div
        initial="hidden"
        animate="show"
        variants={navVariant} 
        className="absolute bottom-0 left-0 right-0 bg-white border-t pt-10 px-6 pb-10 rounded-t-2xl"
      >
        <div
          onClick={() => setNavShown(false)} 
          className="mb-10 flex-end cursor-pointer"
        >
          <MdCancel color="red" size={20} />
        </div>

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

        <button 
          onClick={autoSignIn} 
          className="w-full py-3 text-sm font-open btn-primary mt-8 rounded-full"
        >
          {autoSignInText}
        </button>
      </motion.div>
    </div>
  )
}

export default NavBar