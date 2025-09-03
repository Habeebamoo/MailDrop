import { SlArrowRight } from "react-icons/sl"
import { useTheme } from "../../../context/ThemeContext"
import { IoIosSend } from "react-icons/io";
import { BiPlus } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { useCampaignId } from "../../../context/CampaignContext";
import campaignImg from "../../../assets/campaign.png";

const Dashboard = ({ setActiveTab }: { setActiveTab: React.Dispatch<React.SetStateAction<"campaigns" | "new" | "leads">>
}) => {
  const [campaigns, setCampaigns] = useState<any[]>([])
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

  const getBriefOf = (str: string) => {
    const maxLength = 75;
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str
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
        <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 p-5 rounded-md max-md:mb-3">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Total Campaigns</p>
            <FiEdit size={16} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <h1 className="font-inter text-xl mt-1 dark:text-white">{user!.profile.totalCampaigns}</h1>
        </div>
        <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 p-5 rounded-md max-md:mb-3">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Total Email Sent</p>
            <IoIosSend size={18} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <h1 className="font-inter text-xl mt-1 dark:text-white">{user!.profile.totalEmails}</h1>
        </div>
      </div>
      <h1 className="text-primary mt-6 dark:text-white text-xl font-outfit text-center">All Campaigns</h1>
      {campaigns.length == 0 && 
        <div className="p-14 mt-2 flex-center flex-col gap-2">
          <img src={campaignImg} className="h-35" />
          <p className="text-accent text-sm">You haven't created any campaigns</p>
        </div>
      }
      {campaigns.length >= 1 &&
        <div className="mt-5 p-2">
          {
            campaigns.map((campaign) => {
              return (
                <div className="mb-4 border-b-1 border-b-accentLight dark:border-b-transparent pb-4">
                  <div className="flex-between">
                    <h1 className="text-lg text-primary font-inter dark:text-accentLight">{campaign.title}</h1>
                    <button onClick={() => toLeads(campaign.campaignId)} className="flex-center gap-2 btn-primary text-[12px]">
                      <span>View</span>
                      <SlArrowRight size={10} />
                    </button>
                  </div>
                  <p className="text-sm text-accent font-open mt-1">{getBriefOf(campaign.description)}</p>
                  <div className="flex-start gap-1 mt-1">
                    <div className="flex-start bg-fade p-1 rounded-full pr-3 gap-2 text-[10px] mt-2">
                      <div className="bg-yellow-500 text-white py-1 px-2 rounded-full">Subscribers</div>
                      <p className="text-accent dark:text-white">{campaign.totalSubscribers}</p>
                    </div>
                    <div className="flex-start bg-fade p-1 rounded-full pr-3 gap-2 text-[10px] mt-2">
                      <div className="bg-green-500 text-white py-1 px-2 rounded-full">Created At</div>
                      <p className="text-accent dark:text-white">{campaign.createdAt}</p>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      }
    </section>
  )
}

export default Dashboard