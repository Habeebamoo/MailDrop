import { FaGear } from "react-icons/fa6"
import { FiEdit, FiHome, FiUsers } from "react-icons/fi"
import { NavLink } from "react-router-dom"

const Navbar = () => {
  return (
    <div>
      <div className="max-md:hidden fixed top-0 bottom-0 left-0 w-[170px] bg-secondary">
        <div className="mt-20 pl-3">
          <NavLink 
            to={"/dashboard/home"} 
            className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}
          >
            {({ isActive }) => (
              <div className="flex-center gap-1">
                <FiHome size={15} className={isActive ? "text-white" : "rgb(121, 120, 120)"} />
                <span>Dashboard</span>
              </div>
            )}
          </NavLink>
        </div>
        <div className="mt-2 pl-3">
          <NavLink 
            to={"/dashboard/campaigns"} 
            className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}
          >
            {({ isActive }) => (
              <div className="flex-center gap-1">
                <FiEdit size={15} className={isActive ? "text-white" : "rgb(121, 120, 120)"} />
                <span>Campaigns</span>
              </div>
            )}
          </NavLink>
        </div>
        <div className="mt-2 pl-3">
          <NavLink 
            to={"/dashboard/leads"} 
            className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}
          >
            {({ isActive }) => (
              <div className="flex-center gap-1">
                <FiUsers size={15} className={isActive ? "text-white" : "rgb(121, 120, 120)"} />
                <span>Leads</span>
              </div>
            )}
          </NavLink>
        </div>
        <div className="mt-2 pl-3">
          <NavLink 
            to={"/dashboard/settings"} 
            className={({ isActive }) => isActive ? "nav-link-active" : "nav-link"}
          >
            {({ isActive }) => (
              <div className="flex-center gap-1">
                <FaGear size={15} className={isActive ? "text-white" : "rgb(121, 120, 120)"} />
                <span>Settings</span>
              </div>
            )}
          </NavLink>
        </div>
      </div>
      <div className="md:hidden">
        <div className="fixed bottom-0 left-0 right-0 p-3 rounded-t-lg">
          <div className="backdrop-blur-md bg-white/30 shadow-lg p-4 rounded-full flex justify-around items-center">
            <NavLink
              to={"/dashboard/home"}
            >
              {({ isActive }) => (
                <FiHome color={isActive ? "#000" : "rgba(175, 172, 172, 1)"} size={20} />
              )}
            </NavLink>
            <NavLink
              to={"/dashboard/campaigns"}
            >
              {({ isActive }) => (
                <FiEdit color={isActive ? "#000" : "rgba(175, 172, 172, 1)"} size={20} />
              )}
            </NavLink>
            <NavLink
              to={"/dashboard/leads"}
            >
              {({ isActive }) => (
                <FiUsers color={isActive ? "#000" : "rgba(175, 172, 172, 1)"} size={20} />
              )}
            </NavLink>
            <NavLink
              to={"/dashboard/settings"}
            >
              {({ isActive }) => (
                <FaGear color={isActive ? "#000" : "rgba(175, 172, 172, 1)"} size={20} />
              )}
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar