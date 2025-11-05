import { BiPlus } from "react-icons/bi"
import { CgMail } from "react-icons/cg"
import { FiEdit } from "react-icons/fi"
import History from "../History"
import { useUser } from "../../../context/UserContext"
import { useEffect, useState } from "react"

const Dashboard = ({ setActiveTab }: { setActiveTab: React.Dispatch<React.SetStateAction<"dashboard" | "new">> }) => {
  const [activities, setActivities] = useState<any[]>([])
  const { user } = useUser()

  const newEmail = () => {
    setActiveTab("new")
  }

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
    const emailActivities = arr.filter(obj => obj.type == "email")
    const recent = emailActivities.slice(-4)
    return recent.reverse();
  }

  return (
    <>
      <section className="md:ml-[170px] mt-[57px] px-3 pt-2 pb-25 min-h-[calc(100vh-4rem)]">
        <div className="flex-between mt-4">
          <h1 className="text-xl text-primary font-inter dark:text-white">Emails</h1>
          <button onClick={newEmail} className="px-3 flex-center gap-1 btn-primary">
            <span>New</span>
            <BiPlus />
          </button>
        </div>
        <p className="text-sm text-accent max-md:mt-2 mb-4">Send targeted and promotion emails to your leads and subscribers</p>

        {/* stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 p-4 rounded-xl flex-start gap-4">
            <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
              <FiEdit size={20} color="#6964c9ff" />
            </div>
            <div>
              <p className="font-outfit text-sm text-accent">Total Campaigns</p>
              <h1 className="font-inter text-xl mt-2 dark:text-white">{user!.profile.totalCampaigns}</h1>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 p-4 rounded-xl flex-start gap-4">
            <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
              <CgMail size={20} color="#6964c9ff" />
            </div>
            <div>
              <p className="font-outfit text-sm text-accent">Emails Sent</p>
              <h1 className="font-inter text-xl mt-2 dark:text-white">{user!.profile.totalEmails}</h1>
            </div>
          </div>
        </div>

        <History 
          title="Recent Emails Sent"
          backupText="Latest emails sent would appear here"
          history={getRecentDataOf(activities)}  
        />
      </section>
    </>
  )
}

export default Dashboard