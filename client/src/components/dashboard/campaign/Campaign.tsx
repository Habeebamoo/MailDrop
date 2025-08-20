import { BiSearch, BiTrash } from "react-icons/bi"
import { FaArrowRightFromBracket, FaGears } from "react-icons/fa6"
import { SlArrowLeft } from "react-icons/sl"
import { useTheme } from "../../../context/ThemeContext"
import { CgMail } from "react-icons/cg"
import { FiLink, FiUsers } from "react-icons/fi"
import { FaRegHandPointer } from "react-icons/fa"
import Pagination from "./Pagination"
import { useEffect, useState } from "react"
import Loading from "../Loading"
import { useCampaignId } from "../../../context/CampaignContext"
import { GoHistory } from "react-icons/go"
import Error from "../Error"

const Campaign = ({ setActiveTab }: { setActiveTab: React.Dispatch<React.SetStateAction<"campaigns" | "new" | "leads">>
}) => {
  const [campaign, setCampaign] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)
  const [leads, setLeads] = useState<any[]>([])
  const [query, setQuery] = useState<string>("")
  const { theme } = useTheme()
  const { campaignId } = useCampaignId()

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`https://maildrop-znoo.onrender.com/api/campaign/${campaignId}`, {
          method: "GET",
          credentials: "include",
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
        console.log("something went wrong")
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaign()
  }, [])

  const goBack = () => {
    setActiveTab("campaigns")
  }

  useEffect(() => {
    if (query == "") setLeads([])
  }, [query])
  

  const searchLeads = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    const lowerQuery = query.toLowerCase()
    const result = leads.filter((item) => item.name.toLowerCase().includes(lowerQuery))
    setLeads(result)
  }

  if (loading) return <Loading />

  return (
    <section className="md:ml-[170px] mt-[57px] px-3 pt-2 pb-25 min-h-[calc(100vh-4rem)]">
      {error && <Error title="Unknown Error" text="Failed to get camapign" path="/dashboard/campaigns" pathText="Go Back" /> }
      <div className="flex-between mt-4">
        <h1 className="text-xl text-primary font-inter dark:text-white">Summer Sale 2024</h1>
        <button onClick={goBack} className="px-3 flex-center gap-2 text-sm btn-primary">
          <SlArrowLeft />
        </button>
      </div>
      <p className="text-sm text-accent mb-4 max-md:mt-2">Gadgets and Electronics on 20% discount sales</p>

      <div className="md:grid md:grid-cols-3 md:gap-2 mt-6">
        <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 p-4 rounded-md max-md:mb-3">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Subscribers</p>
            <FiUsers size={16} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <h1 className="font-inter text-xl mt-1 dark:text-white">{campaign.totalSubscribers}</h1>
        </div>
        <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 p-4 rounded-md max-md:mb-3">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Clicks</p>
            <FaRegHandPointer size={16} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <h1 className="font-inter text-xl mt-1 dark:text-white">{campaign.totalClicks}</h1>
        </div>
        <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 p-4 rounded-md max-md:mb-3">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Emails Sent</p>
            <CgMail size={20} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <h1 className="font-inter text-xl mt-1 dark:text-white">{campaign.totalEmails}</h1>
        </div>
      </div>

      <div className="flex-between mt-6">
        <h1 className="text-lg text-primary font-inter dark:text-white">Subscribers</h1>
        <button className="px-3 flex-center gap-2 text-sm btn-primary">
          <span>Export</span>
          <FaArrowRightFromBracket />
        </button>
      </div>
      <p className="text-sm text-accent mb-4">Manage and track your leads</p>

      <div className="text-accent relative">
        <input 
          type="search"
          className="bg-white rounded-md py-1 px-8 border-1 border-accentLight text-sm"
          value={query}
          onChange={searchLeads}
          placeholder="Search leads..."
        />
        <BiSearch className="absolute top-[7px] left-[10px]" />
      </div>
      {leads ? (
        <Pagination data={leads} />
      ) : (
        <div className="p-6 rounded-md bg-white dark:bg-gray-900 dark:border-1 dark:border-gray-800 mt-4">
          <div className="p-14 mt-2 flex-center flex-col gap-4">
            <GoHistory size={50} color="rgb(121, 120, 120)" />
            <p className="text-accent text-sm">Your Subscribers would appear here</p>
          </div>
        </div>
      )}

      <div className="p-6 rounded-md bg-white dark:bg-gray-900 dark:border-1 dark:border-gray-800 mt-6">
        <div className="flex-start gap-2 text-primary dark:text-white">
          <FaGears size={20} />
          <h1 className="text-xl font-outfit">Quick Action</h1>
        </div>
        <button
          className="flex-start gap-2 p-2 rounded-md mt-4 border-1 border-primary text-white bg-primary hover:bg-transparent hover:text-primary cursor-pointer"
        >
          <FiLink size={20} />
          <span className="font-outfit">Share Campaign</span>
        </button>
        <button 
          className="flex-start gap-2 p-2 rounded-md mt-4 border-1 border-red-500 text-white bg-red-500 hover:bg-transparent hover:text-red-500 cursor-pointer"
        >
          <BiTrash size={20} />
          <span className="font-outfit">Delete Campaign</span>
        </button>
      </div>
    </section>
  )
}

export default Campaign