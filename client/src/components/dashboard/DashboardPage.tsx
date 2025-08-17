import { CgMail } from "react-icons/cg"
import { FaRegHandPointer } from "react-icons/fa"
import { FiUsers } from "react-icons/fi"
import { useTheme } from "../../context/ThemeContext"
import History from "./History"
import { GoHistory } from "react-icons/go"
import { useUser } from "../../context/UserContext"

const DashboardPage = () => {
  const { theme } = useTheme()
  const { user } = useUser()

  //default
  const activites = [
    {type: "campaign", text: "Created 'Summer Sale 2024' campaign", time: "9 minutes ago"},
    {type: "email", text: "Sent emails to 'Summer Sale 2024' subscribers", time: "2 hours ago"},
    {type: "profile", text: "Updated Profile Page", time: "5 days ago"}
  ];

  //default
  const campaigns: any[] = [
    {name: "Summer Sale 2024", subscribers: 76, created: "2024-8-24"},
    {name: "Affilate Marketing", subscribers: 388, created: "2024-9-20"}
  ];

  return (
    <section className="md:ml-[170px] mt-[50px] px-4 pt-2 pb-25 min-h-[calc(100vh-4rem)]">
      <h1 className="text-2xl text-primary font-inter mt-4 dark:text-white">Overview</h1>
      <p className="text-sm text-accent mt-1">Welcome back, Here's what's happening with your email campaigns</p>
      <div className="md:grid md:grid-cols-3 md:gap-2 mt-4">
        <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 p-4 rounded-md max-md:mb-3">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Total Campaigns</p>
            <CgMail size={20} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <h1 className="font-inter text-xl mt-1 dark:text-white">{user!.profile.totalCampaigns}</h1>
        </div>
        <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 p-4 rounded-md max-md:mb-3">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Total Subscribers</p>
            <FiUsers size={18} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <h1 className="font-inter text-xl mt-1 dark:text-white">{user!.profile.totalSubscribers}</h1>
        </div>
        <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 p-4 rounded-md">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Clicks</p>
            <FaRegHandPointer size={17} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <h1 className="font-inter text-xl mt-1 dark:text-white">{user!.profile.totalClicks}</h1>
        </div>
      </div>
      <h1 className="text-xl text-primary font-inter mt-6 dark:text-white">Recent Campaigns</h1>
      <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 rounded-sm mt-2">
        {campaigns.length >= 1 &&
          <div className="grid grid-cols-3 gap-1 font-inter text-sm border-b-1 border-b-accentLight dark:border-gray-700 dark:text-white py-3 text-center">
            <p>Campaign</p>
            <p>Subscribers</p>
            <p>Created</p>
          </div>
        }
        {campaigns.length >= 1 &&
          campaigns.map(campaign => {
            return (
              <div className="grid grid-cols-3 gap-1 font-inter text-sm py-3 px-2 text-center text-accent">
                <p>{campaign.name}</p>
                <p>{campaign.subscribers}</p>
                <p>{campaign.created}</p>
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
        history={activites}
      />
    </section>
  )
}

export default DashboardPage
