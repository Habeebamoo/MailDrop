import { CgMail } from "react-icons/cg"
import { FaRegHandPointer } from "react-icons/fa"
import { FiUsers } from "react-icons/fi"
import { useTheme } from "../../context/ThemeContext"
import History from "./History"
import { GoHistory } from "react-icons/go"
import { useUser } from "../../context/UserContext"
import { useEffect, useState } from "react"

const DashboardPage = () => {
  const [activities, setActivities] = useState<any[]>([])
  const [campaigns, setCampaigns] = useState<any[]>([])
  const { theme } = useTheme()
  const { user } = useUser()

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

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("https://maildrop-znoo.onrender.com/api/user/activities", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": import.meta.env.VITE_X_API_KEY
          }
        })

        const response = await res.json()
        
        if (!res.ok) {
          console.log(response.error)
          return
        }

        setActivities(response)
      } catch (err) {
        console.log("something went wrong")
      }
    }

    fetchActivities()
  }, [])

  const getRecentDataOf = (arr: any[]) => {
    const recent = arr.slice(-4)
    return recent.reverse();
  }

  const recentCampaigns = campaigns.slice(-3).reverse()

  return (
    <section className="md:ml-[170px] mt-[50px] px-4 pt-2 pb-25 min-h-[calc(100vh-4rem)]">
      <h1 className="text-2xl text-primary font-inter mt-4 dark:text-white">Overview</h1>
      <p className="text-sm text-accent mt-1">Welcome back, Here's what's happening with your email campaigns</p>
      <div className="md:grid md:grid-cols-3 md:gap-2 mt-4">
        <div className="bg-white dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 p-5 rounded-md max-md:mb-3">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Total Campaigns</p>
            <CgMail size={20} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <h1 className="font-inter text-xl mt-1 dark:text-white">{user!.profile.totalCampaigns}</h1>
        </div>
        <div className="bg-white dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 p-5 rounded-md max-md:mb-3">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Total Subscribers</p>
            <FiUsers size={18} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <h1 className="font-inter text-xl mt-1 dark:text-white">{user!.profile.totalSubscribers}</h1>
        </div>
        <div className="bg-white dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 p-5 rounded-md">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Total Campaign Clicks</p>
            <FaRegHandPointer size={17} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <h1 className="font-inter text-xl mt-1 dark:text-white">{user!.profile.totalClicks}</h1>
        </div>
      </div>
      <h1 className="text-xl text-primary font-inter mt-6 dark:text-white">Recent Campaigns</h1>
      <div className="bg-white dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 rounded-sm mt-2">
        {campaigns.length >= 1 &&
          <div className="grid grid-cols-3 gap-1 font-inter text-sm border-b-1 border-b-bg2 dark:border-gray-700 dark:text-white py-4 text-center">
            <p>Campaign</p>
            <p>Subscribers</p>
            <p>Created</p>
          </div>
        }
        {campaigns.length >= 1 &&
          recentCampaigns.map(campaign => {
            return (
              <div className="grid grid-cols-3 gap-1 font-inter text-sm py-4 px-2 text-center text-accent">
                <p>{campaign.title}</p>
                <p>{campaign.totalSubscribers}</p>
                <p>{campaign.createdAt}</p>
              </div>
            )
          })
        }
        {campaigns.length == 0 &&
          <div className="p-14 mt-2 flex-center flex-col gap-4">
            <GoHistory size={50} color="rgb(121, 120, 120)" />
            <p className="text-accent text-sm">Your campaigns would go here</p>
          </div>
        }
      </div>
      <History 
        title="Recent Activities" 
        backupText="Your recent activities would display here"
        history={getRecentDataOf(activities)}
      />
    </section>
  )
}

export default DashboardPage
