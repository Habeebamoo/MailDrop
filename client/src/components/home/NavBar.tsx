import { useNavigate } from "react-router-dom"
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
      <p className="text-lg mb-3 hover:text-primary cursor-pointer">Home</p>
      <p className="text-lg mb-3 hover:text-primary cursor-pointer">About</p>
      <button onClick={autoSignIn} className="btn-primary mt-1">{autoSignInText}</button>
    </div>
  )
}

export default NavBar