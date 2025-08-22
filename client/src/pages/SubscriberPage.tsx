import { BiCheckCircle, BiMailSend } from "react-icons/bi"
import logo from "../assets/logo.png"
import gift from "../assets/gift.png"
import { IoShieldOutline } from "react-icons/io5"
import { CiMail, CiUser } from "react-icons/ci"
import React, { useEffect, useState } from "react"
import Loading from "../components/dashboard/Loading"
import { useSearchParams } from "react-router-dom"
import Error from "../components/dashboard/Error"
import { toast } from "react-toastify"

const SubscriberPage = () => {
  const [loadingScreen, setLoadingScreen] = useState<boolean>(false)
  const [campaign, setCampaign] = useState<any>([])
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [ searchParams ] = useSearchParams()
  const campaignId = searchParams.get("id")

  const [form, setForm] = useState({
    name: "",
    email: ""
  })

  const defaultData = {
    campaignId: campaign.campaignId,
    userId: campaign.userId
  }

  useEffect(() => {
    if (!campaign) return

    const click = async () => {
      const res = await fetch(`https://maildrop-znoo.onrender.com/api/subscriber/${campaignId}/click`, {
        method: "POST",
        headers: {
          "X-API-KEY": import.meta.env.VITE_X_API_KEY
        }
      })
      const response = await res.json()
      console.log(response)
    }

    click()
  }, [])

  useEffect(() => {
    setLoadingScreen(true)

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
        setError(true)
      } finally {
        setLoadingScreen(false)
      }
    }

    fetchCampaign()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const body = {...form, ...defaultData}

    try {
      const res = await fetch("https://maildrop-znoo.onrender.com/api/subscriber", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY
        },
        body: JSON.stringify(body)
      })
      const response = await res.json()

      if (res.ok) {
        toast.success(response.message)
      } else {
        toast.error(response.error)
      }
    } catch (err) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  } 

  if (loadingScreen) return <Loading />

  if (error) return <Error title="Oops" text="This campaign dosen't exists or it has been deleted" path="/" pathText="Go Back" />

  return (
    <>
      {loading && <Loading />}
      <header className="p-3 fixed top-0 left-0 right-0 bg-white border-b-1 border-b-accentLight">
        <div className="flex-start">
          <img src={logo} alt="Logo" className="h-[30px]" />
          <h1 className="text-xl font-outfit ml-1">MailDrop</h1>
        </div>
      </header>
      <main className="bg-accentXLight mt-13 p-3 min-h-[calc(100vh-4rem)]">
        <div className="mt-6 text-center">
          <h1 className="text-2xl text-primary font-inter">{campaign.title}</h1>
          <p className="text-sm text-accent mt-1 w-[90%] sm:w-[700px] mx-auto">{campaign.description}</p>
        </div>
        {campaign.leadMagnetName &&
          <div className="bg-white border-1 border-accentLight py-4 px-6 rounded-sm mt-6 w-[90%] sm:w-[500px] mx-auto mb-4">
            <h1 className="text-primary font-outfit text-lg text-center">Free Gift Available</h1>
            <div className="my-5">
              <div className="flex-center mx-auto h-30 w-30 bg-accentXLight border-1 border-accentLight rounded-full">
                <img src={gift} className="h-20" />
              </div>
              <h1 className="text-primary text-center mt-3">{campaign.leadMagnetName}</h1>
            </div>
            <p className="text-[12px] text-accent mt-1 text-center">Subscribe to this campaign and receive your gift</p>
          </div>
        }
        <div className="flex-center mt-8">
          <form onSubmit={handleSubmit} className="bg-white border-1 border-accentLight py-4 px-6 rounded-sm w-[90%] sm:w-[500px]">
            <h1 className="text-center text-xl text-primary font-open">Become a Member</h1>
            {campaign.leadMagnetName && 
              <p className="text-accent text-[12px] text-center mt-1">
                Enter your details below and we will send your <b>Gift to your email address</b>
              </p>
            }
            {!campaign.leadMagnetName &&
              <p className="text-accent text-[12px] text-center mt-1">
                Enter your details below to subscribe
              </p>
            }
            <div className="mt-8">
              <label className="text-sm text-accent mb-2 block" htmlFor="name">Full Name *</label>
              <div className="relative">
                <input 
                  type="text" 
                  id="name"    
                  placeholder="Enter your full name"             
                  className="block p-2 pl-9 border-1 w-full rounded-md border-accentLight placeholder:text-sm font-outfit"  
                  value={form.name}
                  onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))}
                  required
                />
                <div className="absolute top-[11px] left-[10px]"><CiUser size={19} /></div>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm text-accent mb-2 block" htmlFor="email">Email Address *</label>
              <div className="relative">
                <input 
                  type="email" 
                  id="email"    
                  placeholder="Enter your email address"             
                  className="block p-2 pl-9 border-1 w-full rounded-md border-accentLight placeholder:text-sm font-outfit"  
                  value={form.email}
                  onChange={(e) => setForm(prev => ({...prev, email: e.target.value}))}
                  required
                />
                <div className="absolute top-[11px] left-[10px]"><CiMail size={19} /></div>
              </div>
            </div>
            <button className="py-2 btn-primary mt-4 w-full">Submit</button>
            <p className="mt-6 text-[10px] text-accent text-center"><i>By submitting this form, you agree to receive marketing emails from <b>MailDrop</b>. You can unsubscribe any time. We respect your privacy and will never share your information</i></p>
          </form>
        </div>
        <div className="flex-center gap-4 py-4 text-[11px] text-accent">
            <div className="flex-center gap-1">
              <IoShieldOutline />
              <span>100% Secure</span>
            </div>
            <div className="flex-center gap-1">
              <BiMailSend />
              <span>No Spam</span>
            </div>
            <div className="flex-center gap-1">
              <BiCheckCircle />
              <span>Instant Access</span>
            </div>
        </div>
        <div className="bg-white border-1 border-accentLight py-4 px-6 rounded-sm mt-6 w-[90%] sm:w-[600px] mx-auto mb-4">
          <div className="flex-start gap-3">
            <div className="h-7 w-7 bg-accentXLight border-1 border-accentLight rounded-full"></div>
            <div>
              <h1>{campaign.username}</h1>
              <p className="text-accent text-[12px]"><i>{campaign.userbio}</i></p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default SubscriberPage