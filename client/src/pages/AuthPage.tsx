import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import { toast } from "react-toastify"
import GoogleLoading from "../components/home/GoogleLoading"
import Spinner from "../components/home/Spinner"

interface GooglePayLoad {
  email: string,
  name: string,
  picture: string,
  sub: string
}

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true)
  const [passwordShown, setPasswordShown] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [googleLoading, setGoogleLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<"success" | "error" | "">("")
  const [msg, setMsg] = useState<string>("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })
  const navigate = useNavigate()

  const handleGoogleSuccess = async (tokenResponse: CredentialResponse) => {
    setGoogleLoading(true)

    try {
      if (tokenResponse.credential) {
        const userInfo = jwtDecode<GooglePayLoad>(tokenResponse.credential);

        const res = await fetch("https://maildrop-znoo.onrender.com/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_X_API_KEY
          },
          body: JSON.stringify({
            name: userInfo.name,
            email: userInfo.email,
            picture: userInfo.picture
          }),
          credentials: "include"
        })
        const response = await res.json()

        if (res.ok) {
          window.location.href = "/dashboard/home"
        } else {
          toast.error(response.error)
        }
      } else {
        toast.error("Google Login Failed")
      }
    } catch (err) {
      toast.error("Something went wrong")
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleGoogleError = () => {
    toast.error("Login error")
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("")
    setMsg("")
    setLoading(true)

    try {
       if (isLogin) {
        const res = await fetch("https://maildrop-znoo.onrender.com/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_X_API_KEY
          },
          body: JSON.stringify({
            email: form.email,
            password: form.password
          }),
          credentials: "include"
        })
        const tokenResponse = await res.json()

        if (!res.ok) {
          setStatus("error")
          setMsg(tokenResponse.error)
        } else {
          window.location.href = "/dashboard/home"
        }
       } else {
        const res = await fetch("https://maildrop-znoo.onrender.com/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_X_API_KEY
          },
          body: JSON.stringify(form),
          credentials: "include"
        })
        const tokenResponse = await res.json()
        
        if (!res.ok) {
          setStatus("error")
          setMsg(tokenResponse.error)
        } else {
          setStatus("success")
          setMsg(tokenResponse.message)
          setTimeout(() => { 
            navigate("/verify")
          }, 2000)
        }
       }
    } catch (err: any) {
      setStatus("error")
      setMsg("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const toggleLogin = () => {
    if (loading) return
    setIsLogin(!isLogin)
  }

  const toForgotPassword = () => {
    navigate("/forgot")
  }

  const togglePassword = () => {
    setPasswordShown(!passwordShown)
  }

  const passwordIcon = passwordShown ? <FaEyeSlash color="rgb(121, 120, 120)" size={19} /> : <FaEye color="rgb(121, 120, 120)" size={19} />

  const authText = 
  isLogin ? 
  <div className={`${loading && "flex-center gap-2"}`}>
    {loading && <Spinner size={15} color="white" />}
    {loading ? "Logging In" : "Login"}
  </div> 
  : 
  <div className={`${loading && "flex-center gap-2"}`}>
    {loading && <Spinner size={15} color="white" />}
    {loading ? "Signing Up" : "Sign Up"}
  </div>

  return (
    <main className="flex-center h-[100vh] bg-bg">
      {googleLoading && <GoogleLoading />}
      <section className="bg-white border-1 border-bg2 rounded-lg px-8 py-10 w-[90%] sm:w-[400px]">
        <h1 className="text-2xl font-outfit text-primary text-center mb-1">{isLogin ? "Welcome Back" : "Create Your Account"}</h1>
        <p className="text-sm text-accent text-center">{isLogin ? "Sign in to your MailDrop account to continue" : "Sign up to create an account with MailDrop"}</p>
        <div className="flex-center mt-4 w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            width="100%"
          />
        </div>
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-accent"></div>
          <span className="mx-4 text-accent text-[11px]">OR CONTINUE WITH EMAIL</span>
          <div className="flex-grow border-t border-accent"></div>
        </div>
        <form onSubmit={handleAuth} className="mt-5">
          {!isLogin &&
            <div className="mb-3">
              <label className="font-inter mb-1 block" htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className="block py-2 px-3 border-1 w-full rounded-md border-accentLight placeholder:text-sm font-outfit" 
                placeholder="Enter your Fullname"
                value={form.name}
                onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))}
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
              className="block py-2 px-3 border-1 w-full rounded-md border-accentLight placeholder:text-sm font-outfit" 
              placeholder="Enter your Email Address"
              value={form.email}
              onChange={(e) => setForm(prev => ({...prev, email: e.target.value}))}
              required
            />
          </div>
          <div className="mb-3 relative">
            <label className="font-inter mb-1 block" htmlFor="password">Password</label>
            <input 
              type={passwordShown ? "text" : "password"} 
              id="password" 
              name="password" 
              className="block py-2 px-3 border-1 w-full rounded-md border-accentLight placeholder:text-sm font-outfit" placeholder="Enter your Password"
              value={form.password}
              onChange={(e) => setForm(prev => ({...prev, password: e.target.value}))}
              required
            />
            <div onClick={togglePassword} className="absolute top-[40px] right-[10px] cursor-pointer">{passwordIcon}</div>
          </div>
          <p 
            onClick={toForgotPassword}  
            className="text-sm ml-1 text-primary font-outfit mb-3 mt-3 cursor-pointer hover:font-inter"
          >
            Forgot Password?
          </p>
          {msg &&
            <div className={`${status == "success" ? "border-green-200 bg-green-100" : "border-red-200 bg-red-100 text-red-400"} text-sm font-open text-center p-3 rounded-sm border-1 mb-2`}>
              <p>{msg}</p>
            </div>
          }
          <button
            className="py-2 btn-primary w-full disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:text-white disabled:border-gray-300"
            disabled={loading}
          >
            {authText}
          </button>
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