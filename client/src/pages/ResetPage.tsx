import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const ResetPage = () => {
  const [passwordShown, setPasswordShown] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleSubmit = () => {
    
  }

  const toLogin = () => {
    navigate("/login")
  }

  const togglePassword = () => {
    setPasswordShown(!passwordShown)
  }

  const passwordIcon = passwordShown ? <FaEyeSlash color="rgb(121, 120, 120)" size={18} /> : <FaEye color="rgb(121, 120, 120)" size={18} />

  return (
    <main className="flex-center h-[100vh] bg-bg">
      <section className="bg-white p-8 rounded-sm w-[90%] sm:w-[400px]">
        <h1 className="text-xl font-outfit text-primary text-center">Reset Your Password</h1>
        <p className="text-sm text-accent text-center">Enter a new password for your account</p>
        <form className="mt-5">
          <div className="mb-3 relative">
            <label className="font-inter mb-1 block" htmlFor="password">Password</label>
            <input 
              type={passwordShown ? "text" : "password"} 
              id="password" 
              name="password" 
              className="block py-2 px-3 border-1 w-full text-accent rounded-md border-accentLight placeholder:text-sm font-outfit" placeholder="Enter your Password"
              required
            />
            <div onClick={togglePassword} className="absolute top-[42px] right-[10px] cursor-pointer">
              {passwordIcon}
            </div>
          </div>
          <div className="mb-3">
            <label className="font-inter mb-1 block" htmlFor="password">Confirm Password</label>
            <input 
              type={passwordShown ? "text" : "password"} 
              id="password" 
              name="password" 
              className="block py-2 px-3 border-1 w-full text-accent rounded-md border-accentLight placeholder:text-sm font-outfit" placeholder="Enter your Password"
              required
            />
          </div>
          <button onClick={handleSubmit} className="py-2 btn-primary w-full mt-4">Submit</button>
          <p onClick={toLogin} className="text-center text-sm text-accent mt-4">
            <span className="text-primary cursor-pointer font-outfit">Back to login</span>
          </p>
        </form>
      </section>
    </main>
  )
}

export default ResetPage