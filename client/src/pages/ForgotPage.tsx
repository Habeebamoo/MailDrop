import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ClipLoader } from "react-spinners"

const ForgotPage = () => {
  const [email, setEmail] = useState<string>("")
  const [msg, setMsg] = useState<string>("")
  const [status, setStatus] = useState<"success" | "error" | "">("")
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("")
    setMsg("")
    setLoading(true)
    if (!email) {
      setStatus("error")
      setMsg("Email is required")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("https://maildrop-znoo.onrender.com/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY
        },
        body: JSON.stringify({
          email: email
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

  return (
    <main className="flex-center h-[100vh] bg-bg">
      <section className="bg-white p-8 rounded-sm w-[90%] sm:w-[400px]">
        <h1 className="text-xl font-outfit text-primary text-center">Forgot Password</h1>
        <p className="text-sm text-accent text-center">Submit your email address in order to recover your account</p>
        <form onSubmit={handleSubmit} className="mt-5">
          <div>
            <label className="font-inter mb-1 block" htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="block py-2 px-3 border-1 w-full rounded-md border-accentLight placeholder:text-sm font-outfit" 
              placeholder="Enter your Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {msg &&
            <div className={`${status == "success" ? "border-green-200 bg-green-100" : "border-red-200 bg-red-100 text-red-400"} text-sm font-open text-center p-3 rounded-sm border-1 mb-2 mt-3`}>
              <p>{msg}</p>
            </div>
          }
          <button
            className="py-2 flex-center btn-primary w-full mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:text-white disabled:border-gray-300"
            disabled={loading}
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

export default ForgotPage