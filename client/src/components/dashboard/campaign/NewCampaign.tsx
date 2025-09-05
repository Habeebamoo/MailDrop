import { useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { FiLink, FiTarget } from "react-icons/fi"
import { IoMdCheckmarkCircle } from "react-icons/io"
import { IoSave } from "react-icons/io5"
import { RiFilePaper2Line } from "react-icons/ri"
import { toast } from "react-toastify"
import Loading from "../Loading"
import { useUser } from "../../../context/UserContext"

const NewCampaign = ({ setActiveTab }: { setActiveTab: React.Dispatch<React.SetStateAction<"campaigns" | "new" | "leads">>
}) => {
  const { user } = useUser()
  const [form, setForm] = useState({
    userId: user?.userId,
    title: "",
    description: "",
    leadMagnetName: "",
    leadMagnetUrl: ""
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [expanded, setExpanded] = useState<boolean>(false)

  const allCampaigns = () => {
    setActiveTab("campaigns")
  }

  const toggleExpansion = () => {
    setExpanded(!expanded)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.leadMagnetName && !form.leadMagnetUrl) {
      toast.error("Lead magnet must have a url")
      return
    } 
    setLoading(true)

    try {
      const res = await fetch("https://maildrop-znoo.onrender.com/api/campaign", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": import.meta.env.VITE_X_API_KEY
        },
        body: JSON.stringify(form)
      })
      const response = await res.json()

      if (res.ok) {
        toast.success(response.message)
        setTimeout(() => window.location.href = "/dashboard/campaigns", 4000)
      } else {
        toast.error(response.error)
      }
    } catch (err) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const expandText = expanded ? "shrink" : "expand"

  return (
    <>
      <section className="md:ml-[170px] mt-[57px] px-3 pt-2 pb-25 min-h-[calc(100vh-4rem)]">
        {loading && <Loading />}
        <div className="flex-between mt-4">
          <h1 className="text-xl text-primary font-inter dark:text-white">Create New Campaign</h1>
          <button onClick={allCampaigns} className="px-3 flex-center gap-1 btn-primary">
            <BiArrowBack />
            <span>Back</span>
          </button>
        </div>
        <p className="text-sm text-accent mb-4 max-md:mt-2">Set up your new email campaign with a compelling lead magnet to attract and convert prospects</p>

        <div className="bg-white dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 p-5 rounded-md max-md:mb-3">
          <div className="flex-start gap-2">
            <FiTarget size={17} color="#231e88" />
            <h1 className="text-lg font-inter dark:text-white">Campaign Details</h1>
          </div>
          <p className="text-sm text-accent">Provide the basic information for your email campaign</p>

          <form onSubmit={handleSubmit}>
            <div className="mt-4 mb-2">
              <label htmlFor="title" className="block font-outfit text-black dark:text-accentLight">Campaign Name</label>
              <input 
                type="text" 
                id="title" 
                placeholder="e.g Summer Sale 2024"
                className="text-black dark:text-white py-2 px-3 border-1 border-accentLight block w-full rounded-md mt-1 dark:bg-gray-800 dark:border-gray-700 placeholder:text-sm placeholder:text-accent" 
                value={form.title}
                onChange={(e) => setForm(prev => ({...prev, title: e.target.value}))}
                required
              />
            </div>
            <div className="mt-4 mb-2">
              <div className="flex-between pr-1 mb-2">
                <label htmlFor="description" className="block font-outfit text-black dark:text-accentLight">Campaign Description</label>
                <span onClick={toggleExpansion} className="text-sm text-open text-primary cursor-pointer dark:text-blue-200">{expandText}</span>
              </div>
              <textarea 
                rows={expanded ? 25 : 6}
                id="description" 
                placeholder="Describe your campaign goals, target audience and key messaging"
                className="text-black dark:text-white py-2 px-3 border-1 border-accentLight block w-full rounded-md mt-1 dark:bg-gray-800 dark:border-gray-700 placeholder:text-sm placeholder:text-accent resize-none"
                value={form.description}
                onChange={(e) => setForm(prev => ({...prev, description: e.target.value}))} 
                required
              ></textarea>
            </div>
            <div className="mt-4 mb-2">
              <label htmlFor="lead-magnet" className="block font-outfit text-black dark:text-accentLight">Reward Name (optional)</label>
              <input 
                type="text" 
                id="lead-magnet" 
                placeholder="Add gift to attract leads to subscribe to your campaign"
                className="text-black dark:text-white py-2 px-3 border-1 border-accentLight block w-full rounded-md mt-1 dark:bg-gray-800 dark:border-gray-700 placeholder:text-sm placeholder:text-accent" 
                value={form.leadMagnetName}
                onChange={(e) => setForm(prev => ({...prev, leadMagnetName: e.target.value}))}
              />
            </div>
            {form.leadMagnetName &&
              <div className="mt-4 mb-2">
                <label htmlFor="url" className="block font-outfit text-black dark:text-accentLight">Reward URL</label>
                <div className="relative">
                  <input 
                    type="text" 
                    id="url" 
                    placeholder="e.g example.com/lead-magnet.pdf"
                    className="text-black dark:text-white py-2 pl-9 pr-3 border-1 border-accentLight block w-full rounded-md mt-1 dark:bg-gray-800 dark:border-gray-700 placeholder:text-sm placeholder:text-accent" 
                    value={form.leadMagnetUrl}
                    onChange={(e) => setForm(prev => ({...prev, leadMagnetUrl: e.target.value}))}
                  />
                  <FiLink color="rgb(121, 120, 120)" size={19} className="absolute top-[12px] left-[12px]" />
                </div>
              </div>
            }
            <button className="flex-center gap-2 btn-primary mt-6">
              <IoSave />
              <span>Create Campaign</span>
            </button>
          </form>
        </div>
        <div className="bg-white dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 p-5 rounded-md max-md:mb-3 mt-4">
          <div className="flex-start gap-2">
            <RiFilePaper2Line size={17} color="orange" />
            <h1 className="text-lg font-inter dark:text-white">Campaign Tips</h1>
          </div>
          <div className="flex-start gap-2 mt-4">
            <IoMdCheckmarkCircle color="green" />
            <div>
              <p className="font-outfit dark:text-white">Clear Campaign Name</p>
              <p className="text-sm text-accent font-outfit">Use descriptive names that indicate the campaign purpose</p>
            </div>
          </div>
           <div className="flex-start gap-2 mt-4">
            <IoMdCheckmarkCircle color="green" />
            <div>
              <p className="font-outfit dark:text-white">Compelling Description</p>
              <p className="text-sm text-accent font-outfit">Explain your goals and target audience clearly</p>
            </div>
          </div>
           <div className="flex-start gap-2 mt-4">
            <IoMdCheckmarkCircle color="green" />
            <div>
              <p className="font-outfit dark:text-white">Valuable Lead Magnet</p>
              <p className="text-sm text-accent font-outfit">Offer something valueable in exchange for thier contact info</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default NewCampaign