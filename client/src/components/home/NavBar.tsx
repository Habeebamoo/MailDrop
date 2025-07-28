import { useNavigate } from "react-router-dom"

const NavBar = () => {
  const naviagate = useNavigate()

  return (
    <div className="flex-center flex-col mt-1 sm:hidden">
      <p className="text-lg mb-2 hover:text-primary cursor-pointer">Home</p>
      <p className="text-lg mb-2 hover:text-primary cursor-pointer">About</p>
      <button onClick={() => naviagate("/login")} className="btn-primary mt-1">Get Started</button>
    </div>
  )
}

export default NavBar