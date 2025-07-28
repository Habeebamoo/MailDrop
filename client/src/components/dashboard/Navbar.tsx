import { FaGear } from "react-icons/fa6"
import { FiEdit, FiHome, FiUsers } from "react-icons/fi"
import { NavLink } from "react-router-dom"

const Navbar = () => {
  return (
    <div>
      <div className="max-md:hidden fixed top-0 bottom-0 left-0 w-[170px] bg-secondary">
        <div className="flex-start mt-17 pl-3">
          <FiEdit size={15} color="rgb(121, 120, 120)" />
          <NavLink 
            to={"/dashboard/campaigns"} 
            className="text-accent cursor-pointer ml-1 font-outfit block hover:text-white"
          >Campaigns</NavLink>
        </div>
        <div className="flex-start mt-2 pl-3">
          <FiUsers size={15} color="rgb(121, 120, 120)" />
          <NavLink 
            to={"/dashboard/leads"} 
            className="text-accent cursor-pointer ml-1 font-outfit block hover:text-white"
          >Leads</NavLink>
        </div>
        <div className="flex-start mt-2 pl-3">
          <FaGear size={15} color="rgb(121, 120, 120)" />
          <NavLink 
            to={"/dashboard/settings"} 
            className="text-accent cursor-pointer ml-1 font-outfit block hover:text-white"
          >Settings</NavLink>
        </div>
      </div>
      <div className="md:hidden">
        <div className="fixed bottom-0 left-0 right-0 p-3 rounded-t-lg">
          <div className="bg-secondary p-4 rounded-full flex justify-around items-ce ter">
            <FiHome color="white" size={20} />
            <FiEdit color="rgb(121, 120, 120)" size={20} />
            <FiUsers color="rgb(121, 120, 120)" size={20} />
            <FaGear color="rgb(121, 120, 120)" size={20} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar