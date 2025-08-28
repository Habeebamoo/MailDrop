import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"

const VerificationPage = () => {
  const [ searchParams ] = useSearchParams()
  const queryCode = searchParams.get("code")

  const [code, setCode] = useState<string>(queryCode ? queryCode : "")
  const [status, setStatus] = useState<"success" | "error" | "">("")
  const [msg, setMsg] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus("")
    setMsg("")
    if (code === "") {
      setStatus("error")
      setMsg("Code is missing")
      return
    }

    try {
      const res = await fetch(`https://maildrop-znoo.onrender.com/api/auth/verify?code=${code}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY
        }
      })
      const response = await res.json()

      if (res.ok) {
        setStatus("success")
        setMsg(response.message)
        setTimeout(() => {
          navigate("/login")
        }, 2000);
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

  return (
    <main className="flex-center h-[100vh] bg-bg">
      <section className="bg-white p-8 rounded-sm w-[90%] sm:w-[400px]">
        <h1 className="text-xl font-outfit text-primary text-center">OTP Verification</h1>
        <p className="text-sm text-accent text-center">Verify your email address to continue on maildrop</p>
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="mb-3">
            <label className="font-inter mb-1 block text-center" htmlFor="code">Verification Code</label>
            <input 
              type="text" 
              id="code" 
              name="code" 
              className="my-8 block py-2 px-3 border-1 w-full rounded-md border-accentLight placeholder:text-sm font-outfit" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          {msg &&
            <div className={`${status == "success" ? "border-green-200 bg-green-100" : "border-red-200 bg-red-100 text-red-400"} text-sm font-open text-center p-3 rounded-sm border-1 mb-2`}>
              <p>{msg}</p>
            </div>
          }
          <button
            className="py-2 btn-primary w-full disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:text-white disabled:border-gray-300 flex-center"
            disabled={loading}
          >
            {loading ? <ClipLoader color="white" size={22} /> : "Verify"}
          </button>
          <p className="text-center text-[12px] text-accent mt-4">
            <span className="text-primary cursor-pointer font-outfit">Note: </span>This code is only valid for 10 minutes
          </p>
        </form>
      </section>
    </main>
  )
}

export default VerificationPage