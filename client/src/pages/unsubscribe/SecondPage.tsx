import { useState } from "react"
import { FaRegThumbsDown } from "react-icons/fa"
import { FaRegMessage } from "react-icons/fa6"
import { FiUserMinus } from "react-icons/fi"
import { HiOutlineSpeakerWave } from "react-icons/hi2"
import { useSearchParams } from "react-router-dom"
import { toast } from "react-toastify"

interface Props {
  nextStep: () => void,
  form: any,
  setForm: React.Dispatch<React.SetStateAction<{
    reason: string;
    comment: string;
  }>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  campaign: any,
  setResponseData: React.Dispatch<any>,
}

const SecondPage = ({ nextStep, form, setForm, setLoading, campaign, setResponseData }: Props) => {
  const [radio, setRadio] = useState<"emails" | "relevant" | "others" | "">("")
  const [comments, setComments] = useState<string>("")
  const [ searchParams ] = useSearchParams()
  const leadId = searchParams.get("leadId")

  const addReason = (radioTxt: any, text: string) => {
    setRadio(radioTxt)
    setForm(prev => ({...prev, reason: text, comment: comments}))
  }

  const unsubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!leadId) {
      toast.error("invalid subscriber")
      return
    }

    const body = {...form, subscriberId: leadId}

    try {
      const res = await fetch(`https://maildrop-znoo.onrender.com/api/subscriber/${leadId}/unsubscribe/${campaign.campaignId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY,
        },
        body: JSON.stringify(body)
      })
      const response = await res.json()

      if (res.ok) {
        nextStep()
        setResponseData(response.data)
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
      <form onSubmit={unsubscribe} className="bg-white p-8 rounded-sm w-[95%] sm:w-[500px] mx-auto mt-10">
        <div className="flex-center h-14 w-14 bg-primary rounded-full mx-auto">
          <FaRegMessage color="#fff" size={22} />
        </div>
        <h1 className="font-inter text-xl mt-2 text-center">Help Us Improve</h1>
        <p className="text-[10px] text-accent mt-1 text-center">Before you go, would you mind telling us why you're unsubscribing? Your feedback helps us improve</p>
        <div className="mt-4">
          <h1 className="text-sm font-open">Why are you unsubscribing? (optional)</h1>
          <div 
            className={`${radio === "emails" ? "radio-active" : "radio"}`}
            onClick={() => addReason("emails", "Too many emails")}
          >
            <HiOutlineSpeakerWave size={18} />
            <p>Too Many Emails</p>
          </div>
          <div 
            className={`${radio === "relevant" ? "radio-active" : "radio"}`}
            onClick={() => addReason("relevant", "Contents are not relevant")}
          >
            <FaRegThumbsDown />
            <p>Content not relevant</p>
          </div>
          <div 
            className={`${radio === "others" ? "radio-active" : "radio"}`}
            onClick={() => addReason("others", "Other reasons")}
          >
            <FaRegMessage />
            <p>Other Reasons</p>
          </div>
        </div>
        <div className="mt-4">
          <h1 className="text-sm font-open">Additional Comments (optional)</h1>
          <textarea 
            className="placeholder:text-accent placeholder:text-sm border-1 border-accentLight p-3 rounded-md w-full resize-none mt-2"
            rows={5} 
            placeholder="Tell us more about your experience or how we could improve"
            value={comments}
            onChange={e => setComments(e.target.value)}
          ></textarea>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="max-md:py-3 w-full btn-primary flex-center gap-2 md:text-sm"
          >
            <FiUserMinus />
            <span>Confirm Unsubscribe</span>
          </button>
        </div>
      </form>
    </>
  )
}

export default SecondPage