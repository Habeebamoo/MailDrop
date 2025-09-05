import { useEffect, useState } from "react"
import Loading from "../../components/dashboard/Loading"
import logo from "../../assets/logo.png"
import ThirdPage from "./ThirdPage"
import SecondPage from "./SecondPage"
import { FaRegHeart, FaStar, FaStarHalfAlt } from "react-icons/fa"
import { FaRegMessage } from "react-icons/fa6"
import { FiUserPlus } from "react-icons/fi"
import { useNavigate, useSearchParams } from "react-router-dom"
import Error from "../../components/dashboard/Error"
import { toast } from "react-toastify"

const Unsubscribe = () => {
  const [campaign, setCampaign] = useState<any>()
  const [responseData, setResponseData] = useState<any>()
  const [loadingScreen, setLoadingScreen] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [step, setStep] = useState<number>(1)
  const [form, setForm] = useState({
    reason: "",
    comment: "",
  })
  const [ searchParams ] = useSearchParams()
  const campaignId = searchParams.get("campaignId")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`https://maildrop-znoo.onrender.com/api/subscriber/campaign/${campaignId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_X_API_KEY
          }
        })
        const response = await res.json()
        
        if (res.ok) {
          setCampaign(response)
        } else {
          setError(true)
        }
      } catch (err) {
        toast.error("Something went wrong.")
        setError(true)
      } finally {
        setLoadingScreen(false)
      } 
    }

    fetchCampaign()
  }, [])

  const nextStep = () => {
    if (step <= 2) {
      setStep(step + 1)
    }
  }

  if (loadingScreen) return <Loading />

  if (error) return <Error title="Oops" text="This campaign dosen't exists or it has been deleted" path="/" pathText="Go Back" />

  return (
    <main className="bg-accentXLight mt-13 p-3 min-h-[calc(100vh-4rem)]">
      {loading && <Loading />}
      <header className="p-3 fixed top-0 left-0 right-0 bg-white border-b-1 border-b-accentLight z-30">
        <div className="flex-start">
          <img src={logo} alt="Logo" className="h-[30px]" />
          <h1 className="text-xl font-outfit ml-1">MailDrop</h1>
        </div>
      </header>
      <div className="flex items-center justify-center space-x-4 mt-[50px] w-[70%] sm:w-[400px] mx-auto">
        <div 
        className={`${step >= 1 ? "bg-primary text-white" : "bg-accentLight text-accent"} h-9 w-9 rounded-full flex-center`}>1</div>
        <div className={`flex-1 w-2 h-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-accentLight"} `}></div>
        <div className={`${step == 2 ? "bg-primary text-white" : "bg-accentLight text-accent"} h-9 w-9 rounded-full flex-center`}>2</div>
      </div>
      {step === 1 && 
        <SecondPage 
          nextStep={nextStep} 
          form={form} 
          setForm={setForm} 
          setLoading={setLoading} 
          campaign={campaign} 
          setResponseData={setResponseData}
      />}
      {step === 2 && <ThirdPage responseData={responseData} />}
      <div className="bg-white p-5 rounded-sm w-[95%] sm:w-[500px] mx-auto mt-5">
        <div className="flex-start gap-2">
          <FaRegHeart color="red" />
          <h1 className="font-inter">Why People Stay</h1>
        </div>
        <div className="mt-4 flex-start gap-2">
          <div className="flex-start">
            <FaStar color="gold" />
            <FaStar color="gold" />
            <FaStar color="gold" />
            <FaStar color="gold" />
            <FaStarHalfAlt color="gold" />
          </div>
          <p className="text-accent text-sm font-open">4.6/5 rating</p>
        </div>
        <p className="text-sm text-accent mt-4 font-open"><i>"MailDrop emails are the only ones i actually look forward to reading. Great content!"</i></p>
        <p className="text-[12px] text-accent mt-3 font-open">- Folashade K., Marketing Director</p>
        <hr className="text-accentLight mt-4" />
        <p className="text-[12px] text-accent mt-3 font-open text-center">Join 150+ professionals who trusts MailDrop</p>
      </div>
      <div className="bg-white p-5 rounded-sm w-[95%] sm:w-[500px] mx-auto mt-5 mb-10">
        <h1 className="font-inter">Need Help?</h1>
        <div className="flex-start gap-2 text-primary mt-4 text-sm">
          <FaRegMessage />
          <span>Contact Us</span>
        </div>
        <div onClick={() => navigate("/")} className="flex-start gap-2 text-primary mt-2 text-sm">
          <FiUserPlus />
          <span>Create an Account</span>
        </div>
      </div>
    </main>
  )
}

export default Unsubscribe