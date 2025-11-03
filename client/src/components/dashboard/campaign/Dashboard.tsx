import emailImg from "../../../assets/illustration.jpeg"
import { useTheme } from "../../../context/ThemeContext"
import { IoIosSend } from "react-icons/io";
import { BiPlus } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { useCampaignId } from "../../../context/CampaignContext";
import { MdCampaign } from "react-icons/md";
import { CgMail } from "react-icons/cg";

const Dashboard = ({ setActiveTab }: { setActiveTab: React.Dispatch<React.SetStateAction<"campaigns" | "new" | "leads">>
}) => {
  const [campaigns, setCampaigns] = useState<any[]>([
    {title: "Summer Sale", createdAt: "8 months"}
  ])
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
  
  return (
    <section className="md:ml-[170px] mt-[57px] px-3 pt-2 pb-25 min-h-[calc(100vh-4rem)]">
      <div className="flex-between mt-4">
        <h1 className="text-xl text-primary font-inter dark:text-white">Campaigns</h1>
        <button onClick={newCampaign} className="px-3 py-2 flex-center gap-1 btn-primary">
          <BiPlus size={20} />
        </button>
      </div>
      <p className="text-sm font-open text-accent mb-4 max-md:mt-2">Create and manage your email campaigns</p>

      {/* stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 p-4 rounded-xl flex-start gap-4">
          <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
            <FiEdit size={20} color="#2f299cff" />
          </div>
          <div>
            <p className="font-outfit text-sm text-accent">Total Campaigns</p>
            <h1 className="font-inter text-xl mt-2 dark:text-white">{user!.profile.totalCampaigns}</h1>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 p-4 rounded-xl flex-start gap-4">
          <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
            <IoIosSend size={20} color="#2f299cff" />
          </div>
          <div>
            <p className="font-outfit text-sm text-accent">Total Emails Sent</p>
            <h1 className="font-inter text-xl mt-2 dark:text-white">{user!.profile.totalEmails}</h1>
          </div>
        </div>

      </div>
      <h1 className="text-primary mt-6 dark:text-white text-xl font-outfit text-center">All Campaigns</h1>
      {campaigns.length == 0 && 
        <div className="p-14 mt-2 flex-center flex-col gap-2">
          <div className="bg-primary text-white h-20 w-20 flex-center rounded-full">
            <MdCampaign size={40} />
          </div>
          <p className="text-accent text-sm mt-2 font-inter">You haven't created any campaigns</p>
        </div>
      }
      {campaigns.length >= 1 &&
        <div className="mt-5 p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {
            campaigns.map((campaign) => {
              return (
                <div 
                  onClick={() => toLeads(campaign.campaignId)}
                  className="bg-white dark:bg-gray-900 border-1 border-accentLight border-l-2 border-l-primary rounded-lg dark:border-gray-800 cursor-pointer"
                >
                  <div className="relative z-10 overflow-hidden h-40 border-b-1 border-b-gray-200 rounded-t-lg">
                    <img src={emailImg} className="object-center object-cover h-full w-full" />
                    <div className="absolute flex-center bg-white/85 inset-0 rounded-t-lg">
                      <p className="font-inter text-gray-400">Click to view</p>
                    </div>
                  </div>
                  <div className="flex-start gap-2 px-4 mt-4">
                    <div className="bg-gray-200 p-2 inline-block rounded-lg">
                      <CgMail size={20} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
                    </div>
                    <div className="px-1">
                      <h1 className="text-xl font-inter dark:text-accentLight">{campaign.title}</h1>
                    </div>
                  </div>
                  <div className="ml-4 mb-4 mt-4 flex-start bg-gray-200 rounded-full inline-block py-2 pl-2 pr-4 text-[12px]">
                    <span className="bg-blue-800 font-open py-1 px-3 rounded-full text-white">Created</span>
                    <span className="ml-2">{campaign.createdAt}</span>
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