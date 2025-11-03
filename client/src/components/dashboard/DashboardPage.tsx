import { CgMail } from "react-icons/cg"
import { FaRegHandPointer } from "react-icons/fa"
import { FiUsers } from "react-icons/fi"
import { useTheme } from "../../context/ThemeContext"
import History from "./History"
import { useUser } from "../../context/UserContext"
import { useEffect, useState } from "react"

const DashboardPage = () => {
  const [activities, setActivities] = useState<any[]>([])
  const { theme } = useTheme()
  const { user } = useUser()

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

  return (
    <section className="md:ml-[170px] mt-[50px] px-4 pt-2 pb-25 min-h-[calc(100vh-4rem)]">
      {/* stats */}
      <h1 className="text-2xl text-primary font-inter mt-5 dark:text-white">Hello, {user?.name}</h1>
      <p className="text-sm text-accent font-open mt-1">Welcome back, Here's what's happening with your email campaigns</p>
      <div className="grid md:grid-cols-3 gap-3 mt-4">
        <div className="bg-white dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 p-4 rounded-xl flex-start gap-4">
          <div className="bg-gray-200 p-4 rounded-lg">
            <CgMail size={20} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <div>
            <p className="font-outfit text-sm text-accent">Total Campaigns</p>
            <h1 className="font-inter text-xl mt-2 dark:text-white">{user!.profile.totalCampaigns}</h1>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 p-4 rounded-xl flex-start gap-4">
          <div className="bg-gray-200 p-4 rounded-lg">
            <FiUsers size={18} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <div>
            <p className="font-outfit text-sm text-accent">Total Subscribers</p>
            <h1 className="font-inter text-xl mt-2 dark:text-white">{user!.profile.totalSubscribers}</h1> 
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 p-4 rounded-xl flex-start gap-4">
          <div className="bg-gray-200 p-4 rounded-lg">
            <FaRegHandPointer size={17} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <div>
            <p className="font-outfit text-sm text-accent">Total Campaign Clicks</p>
            <h1 className="font-inter text-xl mt-2 dark:text-white">{user!.profile.totalClicks}</h1>
          </div>
        </div>
      </div>

      {/* others */}
      <History 
        title="Recent Activities" 
        backupText="Your recent activities would display here"
        history={getRecentDataOf(activities)}
      />
    </section>
  )
}

export default DashboardPage
