import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import googleIcon from "../assets/google.png"
import { useNavigate } from "react-router-dom"

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true)
  const [passwordShown, setPasswordShown] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = "/dashboard/home"
  }

  const toggleLogin = () => {
    setIsLogin(!isLogin)
  }

  const toForgotPassword = () => {
    navigate("/forgot")
  }

  const togglePassword = () => {
    setPasswordShown(!passwordShown)
  }

  const passwordIcon = passwordShown ? <FaEyeSlash color="rgb(121, 120, 120)" size={18} /> : <FaEye color="rgb(121, 120, 120)" size={18} />

  return (
    <main className="flex-center h-[100vh] bg-bg">
      <section className="bg-white p-8 rounded-sm w-[90%] sm:w-[400px]">
        <h1 className="text-xl font-outfit text-primary text-center">{isLogin ? "Welcome Back" : "Create Your Account"}</h1>
        <p className="text-sm text-accent text-center">{isLogin ? "Sign in to your MailDrop account to continue" : "Sign up to create an account with MailDrop"}</p>
        <div>
          <button className="font-inter text-sm p-2 border-1 w-full mt-6 rounded-md border-accentLight flex-center hover:bg-accentLight cursor-pointer">
            <img src={googleIcon} className="h-4" />
            <span className="ml-2">Continue with Google</span>
          </button>
        </div>
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-accent"></div>
          <span className="mx-4 text-accent text-[11px]">OR CONTINUE WITH EMAIL</span>
          <div className="flex-grow border-t border-accent"></div>
        </div>
        <form className="mt-5">
          {!isLogin &&
            <div className="mb-3">
              <label className="font-inter mb-1 block" htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className="block py-2 px-3 border-1 w-full text-accent rounded-md border-accentLight placeholder:text-sm font-outfit" 
                placeholder="Enter your Fullname"
                required
              />
            </div>
          }
          <div className="mb-3">
            <label className="font-inter mb-1 block" htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="block py-2 px-3 border-1 w-full text-accent rounded-md border-accentLight placeholder:text-sm font-outfit" 
              placeholder="Enter your Email Address"
              required
            />
          </div>
          <div className="mb-3 relative">
            <label className="font-inter mb-1 block" htmlFor="password">Password</label>
            <input 
              type={passwordShown ? "text" : "password"} 
              id="password" 
              name="password" 
              className="block py-2 px-3 border-1 w-full text-accent rounded-md border-accentLight placeholder:text-sm font-outfit" placeholder="Enter your Password"
              required
            />
            <div onClick={togglePassword} className="absolute top-[42px] right-[10px] cursor-pointer">{passwordIcon}</div>
          </div>
          <p 
            onClick={toForgotPassword}  
            className="text-sm ml-1 text-primary font-outfit mb-3 mt-3 cursor-pointer hover:font-inter"
          >
            Forgot Password?
          </p>
          <button onClick={handleAuth} className="py-2 btn-primary w-full">{isLogin ? "Login" : "Sign Up"}</button>
          <p className="text-center text-sm text-accent mt-4">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="text-primary cursor-pointer font-outfit" onClick={toggleLogin}>{isLogin ? "Sign Up" : "Login"}</span>
          </p>
        </form>
      </section>
    </main>
  )
}

export default AuthPage