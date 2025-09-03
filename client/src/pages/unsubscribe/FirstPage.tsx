import { useState } from "react";
import { FaUserMinus } from "react-icons/fa6"
import { FiMail, FiUserMinus } from "react-icons/fi"
import { toast } from "react-toastify";

interface Props {
  nextStep: () => void,
  setForm: React.Dispatch<React.SetStateAction<{
    email: string;
    reason: string;
    comment: string;
  }>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  campaign: any,
}

const FirstPage = ({ nextStep, setForm, setLoading, campaign }: Props) => {
  const [email, setEmail] = useState<string>("")

  const verifyEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!email) {
      setLoading(false)
      toast.error("Missing field email")
      return
    }
    setForm(prev => ({...prev, email: email}))

    try {
      const res = await fetch(`https://maildrop-znoo.onrender.com/api/campaign/${campaign.campaignId}/subscriber/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
        body: JSON.stringify({
          email: email
        })
      })
      const response = await res.json()

      if (res.ok) {
        nextStep()
      } else {
        toast.error(response.error)
      }
    } catch (err) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    } 
  }

  return (
    <>
      <form onSubmit={verifyEmail} className="bg-white p-8 rounded-sm w-[95%] sm:w-[500px] mx-auto mt-10">
        <div className="flex-center h-10 w-10 bg-primary rounded-full mx-auto">
          <FiUserMinus color="#fff" size={18} />
        </div>
        <h1 className="font-inter text-xl mt-1 text-center">Unsubscribe</h1>
        <p className="text-[10px] text-accent mt-1 text-center">We're sorry to see you go. Please enter your email address to unsubscribe from our campaign</p>
        <div className="mt-6">
          <label htmlFor="email" className="font-outfit">Email Address *</label>
          <div className="relative">
            <input 
              type="email" 
              className="py-2 placeholder:text-accent text-sm px-10 rounded-md mt-1 border-accentLight border-1 w-full"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="text-accentLight absolute top-[14px] left-3"><FiMail size={20} /></div>
          </div>
        </div>
        <button 
          className="btn-primary w-full flex-center gap-2 py-2 font-inter text-sm mt-4"
        >
          <FaUserMinus />
          <span>Continue to Unsubscribe</span>
        </button>
      </form>
    </>
  )
}

export default FirstPage