import React, { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"

const ResetPage = () => {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: ""
  })
  const [passwordShown, setPasswordShown] = useState<boolean>(false)
  const [msg, setMsg] = useState<string>("")
  const [status, setStatus] = useState<"success" | "error" | "">("")
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const [ searchParams ] = useSearchParams()
  const token = searchParams.get("token")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("")
    setMsg("")
    setLoading(true)
    if (form.password !== form.confirmPassword) {
      setStatus("error")
      setMsg("Password does not match")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("https://maildrop-znoo.onrender.com/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY
        },
        body: JSON.stringify({
          token: token,
          password: form.password
        })
      })
      const response = await res.json()

      if (res.ok) {
        setStatus("success")
        setMsg(response.message)
      } else {
        setStatus("error")
        setMsg(response.error)
      }
    } catch (err) {
      setStatus("error")
      setMsg("Something went wrong.")
    } finally {
      setLoading(false)
    }
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
        <form onSubmit={handleSubmit} className="mt-5">
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
              className="block py-2 px-3 border-1 w-full rounded-md border-accentLight placeholder:text-sm font-outfit" placeholder="Enter your Password"
              value={form.confirmPassword}
              onChange={(e) => setForm(prev => ({...prev, confirmPassword: e.target.value}))}
              required
            />
          </div>
          {msg &&
            <div className={`${status == "success" ? "border-green-200 bg-green-100" : "border-red-200 bg-red-100 text-red-400"} text-sm font-open text-center p-3 rounded-sm border-1 mb-2 mt-3`}>
              <p>{msg}</p>
            </div>
          }
          <button 
            disabled={loading}
            className="py-2 flex-center btn-primary w-full mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:text-white disabled:border-gray-300"
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Submit"}
          </button>
          <p onClick={toLogin} className="text-center text-sm text-accent mt-4">
            <span className="text-primary cursor-pointer font-outfit">Back to login</span>
          </p>
        </form>
      </section>
    </main>
  )
}

export default ResetPage