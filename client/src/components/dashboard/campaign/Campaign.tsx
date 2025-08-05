import { BiSearch, BiTrash } from "react-icons/bi"
import { FaArrowRightFromBracket, FaGears } from "react-icons/fa6"
import { SlArrowLeft, SlArrowRight } from "react-icons/sl"
import { useTheme } from "../../../context/ThemeContext"
import { CgMail } from "react-icons/cg"
import { FiLink, FiUsers } from "react-icons/fi"
import { FaRegHandPointer } from "react-icons/fa"

const Campaign = ({ setActiveTab }: { setActiveTab: React.Dispatch<React.SetStateAction<"campaigns" | "new" | "leads">>
}) => {
  const { theme } = useTheme()

  const goBack = () => {
    setActiveTab("campaigns")
  }

  //default
  const Leads = [
    {"name": "John Smith", "email": "john@example.com"},
    {"name": "Sarah Johnson", "email": "sarah@startup.io"},
    {"name": "Mike Davis", "email": "mike@business.com"},
    {"name": "Elena Jenkins", "email": "elanajenkins@gmail.com"},
    {"name": "Jace Freeman", "email": "jacefreeman21@yahoo.com"},
    {"name": "Alex Johnson", "email": "alex@example.com"},
    {"name": "Sean Walker", "email": "walker@alias.com"},
    {"name": "Alexander Shmrik", "email": "alex@orctelecoms.com"},
    {"name": "Justin Trudae", "email": "justintrudae200@yahoo.com"},
    {"name": "John Charpel", "email": "johncharpel98@gmail.com"},
  ];

  return (
    <section className="md:ml-[170px] mt-[57px] px-3 pt-2 pb-25 min-h-[calc(100vh-4rem)]">
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
          <h1 className="font-inter text-xl mt-1 dark:text-white">21</h1>
        </div>
        <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 p-4 rounded-md max-md:mb-3">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Clicks</p>
            <FaRegHandPointer size={16} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <h1 className="font-inter text-xl mt-1 dark:text-white">30</h1>
        </div>
        <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 p-4 rounded-md max-md:mb-3">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Emails Sent</p>
            <CgMail size={20} color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          </div>
          <h1 className="font-inter text-xl mt-1 dark:text-white">2</h1>
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
          placeholder="Search leads..."
        />
        <BiSearch className="absolute top-[7px] left-[10px]" />
      </div>
      <div className="bg-white dark:bg-gray-900 border-1 border-accentLight dark:border-gray-800 rounded-sm mt-4">
        <div className="grid grid-cols-4 md:grid-cols-3 gap-1 font-inter text-sm border-b-1 border-b-accentLight dark:border-gray-700 dark:text-white py-3">
          <p className="pl-4">S/N</p>
          <p>Name</p>
          <p>Email</p>
        </div>

        {Leads.map((lead, i) => {
          return (
            <>
            <div className="grid grid-cols-4 md:grid-cols-3 gap-1 font-inter text-sm border-b-1 border-b-accentLight dark:border-gray-700 text-accent py-3">
              <p className="pl-6">{i+1}</p>
              <p>{lead.name}</p>
              <p>{lead.email}</p>
            </div>
            </>
          )
        })}   

      </div>
      <div className="flex-center gap-2 mt-4 text-accent">
        <div className="cursor-pointer py-2 px-3 hover:bg-white rounded-lg"><SlArrowLeft /></div>
        <div className="bg-white py-2 px-3 rounded-lg">1</div>
        <div className="py-2 px-3 rounded-lg">2</div>
        <div className="py-2 px-3 rounded-lg">3</div>
        <div className="cursor-pointer py-2 px-3 hover:bg-white rounded-lg"><SlArrowRight /></div>
      </div>

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