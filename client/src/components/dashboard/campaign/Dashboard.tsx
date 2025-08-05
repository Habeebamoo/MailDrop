import { SlArrowLeft, SlArrowRight } from "react-icons/sl"
import { useTheme } from "../../../context/ThemeContext"
import { IoIosSend } from "react-icons/io";
import { BiPlus } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";

const Dashboard = ({ setActiveTab }: { setActiveTab: React.Dispatch<React.SetStateAction<"campaigns" | "new" | "leads">>
}) => {
  const { theme } = useTheme()

  const newCampaign = () => {
    setActiveTab("new")
  }

  const toLeads = () => {
    setActiveTab("leads")
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
          <h1 className="font-inter text-xl mt-1 dark:text-white">0</h1>
        </div>
        <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 p-4 rounded-md max-md:mb-3">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Total Email Sent</p>
            <IoIosSend size={18} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <h1 className="font-inter text-xl mt-1 dark:text-white">0</h1>
        </div>
      </div>
      <h1 className="text-primary my-6 dark:text-white text-xl font-outfit">All Campaigns</h1>
      <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 rounded-sm mt-2">
        <div className="grid grid-cols-4 gap-1 font-inter text-sm border-b-1 border-b-accentLight dark:border-gray-700 dark:text-white py-3 text-center">
          <p>Campaign</p>
          <p>Status</p>
          <p>Created</p>
          <p>Action</p>
        </div>
        <div className="grid grid-cols-4 gap-1 font-inter text-sm py-3 px-2 text-center text-accent">
          <p>Summer Sale 2024</p>
          <div>
            <p className="bg-green-400 px-2 py-1 rounded-md text-white inline">Active</p>
          </div>
          <p>2024-8-24</p>
          <div onClick={toLeads} className="flex-center cursor-pointer">
            <SlArrowRight />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1 font-inter text-sm py-3 px-2 text-center text-accent">
          <p>Affiliate Marketing</p>
          <div>
            <p className="bg-red-400 px-2 py-1 rounded-md text-white inline">Paused</p>
          </div>
          <p>2024-9-20</p>
          <div onClick={toLeads} className="flex-center cursor-pointer">
            <SlArrowRight />
          </div>
        </div>
      </div>
      <div className="flex-center gap-2 mt-4 text-accent">
        <div className="cursor-pointer py-2 px-3 hover:bg-white rounded-lg"><SlArrowLeft /></div>
        <div className="bg-white py-2 px-3 rounded-lg">1</div>
        <div className="py-2 px-3 rounded-lg">2</div>
        <div className="py-2 px-3 rounded-lg">3</div>
        <div className="cursor-pointer py-2 px-3 hover:bg-white rounded-lg"><SlArrowRight /></div>
      </div>
    </section>
  )
}

export default Dashboard