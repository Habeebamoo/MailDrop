import { SlArrowRight } from "react-icons/sl"
import { useTheme } from "../../../context/ThemeContext"
import { IoIosSend } from "react-icons/io";
import { BiPlus, BiSearch } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { GoHistory } from "react-icons/go";
import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { useCampaignId } from "../../../context/CampaignContext";

const Dashboard = ({ setActiveTab }: { setActiveTab: React.Dispatch<React.SetStateAction<"campaigns" | "new" | "leads">>
}) => {
  const [initCampaign, setInitCampaign] = useState<any[]>([])
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [query, setQuery] = useState<string>("")
  const { theme } = useTheme()
  const { user } = useUser()
  const { setCampaignId } = useCampaignId()

  console.log(campaigns)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch(`https://maildrop-znoo.onrender.com/api/campaign?userId=${user?.userId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_X_API_KEY
          }
        })
        const response = await res.json()

        if (res.ok) {
          setInitCampaign(response)
          setCampaigns(response)
        } else {
          return
        }
      } catch (err) {
        console.log("something went wrong")
      }
    }

    fetchCampaigns()
  }, [])

  const newCampaign = () => {
    setActiveTab("new")
  }

  const toLeads = (id: string) => {
    setActiveTab("leads")
    setCampaignId(id)
  }

  useEffect(() => {
    if (query == "") setCampaigns(initCampaign)
  }, [query])

  const searchCampaigns = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    const lowerQuery = query.toLowerCase()
    const result = campaigns.filter((item) => item.name.toLowerCase().includes(lowerQuery))
    setCampaigns(result)
  }
  
  return (
    <section className="md:ml-[170px] mt-[57px] px-3 pt-2 pb-25 min-h-[calc(100vh-4rem)]">
      <div className="flex-between mt-4">
        <h1 className="text-xl text-primary font-inter dark:text-white">Campaigns</h1>
        <button onClick={newCampaign} className="px-3 flex-center gap-1 btn-primary">
          <span>New</span>
          <BiPlus />
        </button>
      </div>
      <p className="text-sm text-accent mb-4 max-md:mt-2">Create and manage your email campaigns</p>

      <div className="md:grid md:grid-cols-2 md:gap-2 mt-4">
        <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 p-4 rounded-md max-md:mb-3">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Total Campaigns</p>
            <FiEdit size={16} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <h1 className="font-inter text-xl mt-1 dark:text-white">{user!.profile.totalCampaigns}</h1>
        </div>
        <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 p-4 rounded-md max-md:mb-3">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Total Email Sent</p>
            <IoIosSend size={18} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <h1 className="font-inter text-xl mt-1 dark:text-white">{user!.profile.totalEmails}</h1>
        </div>
      </div>
      <h1 className="text-primary mt-6 dark:text-white text-xl font-outfit">All Campaigns</h1>
      <div className="text-accent relative my-4">
        <input 
          type="search"
          className="bg-white rounded-md py-2 px-8 border-1 border-accentLight text-sm"
          value={query}
          onChange={searchCampaigns}
          placeholder="Search campaigns..."
        />
        <BiSearch className="absolute top-[7px] left-[10px]" />
      </div>
      <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 rounded-sm mt-2">
      {campaigns.length >= 1 &&
          <div className="grid grid-cols-4 gap-1 font-inter text-sm border-b-1 border-b-accentLight dark:border-gray-700 dark:text-white py-3 text-center">
            <p>Campaign</p>
            <p>Subscribers</p>
            <p>Created</p>
            <p>Action</p>
          </div>
        } 
        {campaigns.length >= 1  &&
          campaigns.map(campaign => {
            return (
              <div className="grid grid-cols-4 gap-1 font-inter text-sm py-3 px-2 text-center text-accent">
                <p>{campaign.title}</p>
                <p>{campaign.totalSubscribers}</p>
                <p>{campaign.createdAt}</p>
                <div onClick={() => toLeads(campaign.campaignId)} className="flex-center cursor-pointer">
                  <SlArrowRight />
                </div>
              </div>
            )
          })
        }
        {campaigns.length == 0 && 
          <div className="p-14 mt-2 flex-center flex-col gap-4">
            <GoHistory size={50} color="rgb(121, 120, 120)" />
            <p className="text-accent text-sm">You haven't created any campaigns</p>
          </div>
        }
      </div>
    </section>
  )
}

export default Dashboard