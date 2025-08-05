import { BiCamera, BiMoon } from "react-icons/bi"
import { FaGears } from "react-icons/fa6"
import { FiUser } from "react-icons/fi"
import { HiArrowLeftStartOnRectangle } from "react-icons/hi2"
import { IoSave } from "react-icons/io5"
import { useTheme } from "../../context/ThemeContext"
import { FaSun } from "react-icons/fa"

const Settings = () => {
  const { theme, setTheme } = useTheme()

  const handleTheme = () => {
    if (theme == "light") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  return (
    <section className="md:ml-[170px] mt-[57px] px-3 pt-2 pb-25 min-h-[calc(100vh-4rem)]">
      <h1 className="text-xl text-primary dark:text-white font-inter mt-4">Settings</h1>
      <p className="text-sm text-accent mb-6">Manage your account settings and preference</p>
      <div className="md:grid md:grid-cols-2 gap-2 items-start">
        <div className="p-6 rounded-md bg-white dark:bg-gray-900 dark:border-1 dark:border-gray-800 text-primary dark:text-white">
          <div className="flex-start gap-2">
            <FiUser size={20} />
            <h1 className="text-xl font-outfit">Profile Information</h1>
          </div>
          <p className="text-sm text-accent dark:text-accentLight">Update your personal information and profile details</p>

          <div className="mt-6 flex-start gap-8 px-4">
            <div className="h-18 w-18 bg-accentXLight border-1 border-accentLight rounded-full"></div>
            <div>
              <button className="flex-center gap-2 py-1 px-3 border-1 border-accentLight rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-accent cursor-pointer">
                <BiCamera />
                <span className="font-outfit">Change Photo</span>
              </button>
              <p className="text-sm mt-2 text-accent dark:text-accentLight">JPG or PNG, Max size 5MB.</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-2">
              <label htmlFor="name" className="block font-outfit text-black dark:text-accentLight">Full Name</label>
              <input type="text" className="py-2 px-3 border-1 border-accentLight block w-full rounded-md mt-1 dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div className="mb-2">
              <label htmlFor="email" className="block font-outfit text-black dark:text-accentLight">Email Address</label>
              <input type="email" className="py-2 px-3 border-1 border-accentLight block w-full rounded-md mt-1 dark:bg-gray-800 dark:border-gray-700" />
            </div>
            <div className="mb-2">
              <label htmlFor="bio" className="block font-outfit text-black dark:text-accentLight">Bio</label>
              <textarea name="bio" rows={4} id="bio" className="py-2 px-3 border-1 border-accentLight block w-full rounded-md mt-1 resize-none dark:bg-gray-800 dark:border-gray-700"></textarea>
            </div>
            <button className="mt-4 flex-center gap-2 btn-primary">
              <IoSave />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
        <div className="p-6 rounded-md bg-white dark:bg-gray-900 dark:border-1 dark:border-gray-800 max-md:mt-4">
          <div className="flex-start gap-2 text-primary dark:text-white">
            <FaGears size={20} />
            <h1 className="text-xl font-outfit">Quick Action</h1>
          </div>
          <button 
            onClick={handleTheme} 
            className="flex-start gap-2 p-2 rounded-md mt-4 border-1 border-accentLight w-full hover:bg-accentLight cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:text-accent">
            {theme == "light" ? <BiMoon size={20} /> : <FaSun size={20} />}
            <span className="font-outfit">Enable {theme == "light" ? "Dark" : "Light"} Theme</span>
          </button>
          <button 
            className="flex-start gap-2 p-2 rounded-md mt-4 border-1 border-accentLight w-full text-red-500 hover:bg-accentLight cursor-pointer dark:bg-gray-800 dark:border-gray-700"
          >
            <HiArrowLeftStartOnRectangle size={20} />
            <span className="font-outfit">Sign Out</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Settings