import { BiCamera, BiMoon } from "react-icons/bi"
import { FaGears } from "react-icons/fa6"
import { FiUser } from "react-icons/fi"
import { HiArrowLeftStartOnRectangle } from "react-icons/hi2"
import { IoSave } from "react-icons/io5"

const Settings = () => {
  return (
    <section className="md:ml-[170px] mt-[57px] px-3 pt-2 pb-25">
      <h1 className="text-xl text-primary font-inter mt-3">Settings</h1>
      <p className="text-sm text-accent mb-4">Manage your account settings and preference</p>
      <div className="md:grid md:grid-cols-2 gap-2 items-start">
        <div className="p-6 rounded-md bg-white">
          <div className="flex-start gap-2">
            <FiUser color="#231e88" size={20} />
            <h1 className="text-xl text-primary font-outfit">Profile Information</h1>
          </div>
          <p className="text-sm text-accent">Update your personal information and profile details</p>

          <div className="mt-6 flex-start gap-8 px-4">
            <div className="h-18 w-18 bg-accentXLight border-1 border-accentLight rounded-full"></div>
            <div>
              <button className="flex-center gap-2 py-1 px-3 border-1 border-accentLight rounded-md">
                <BiCamera />
                <span className="font-outfit">Change Photo</span>
              </button>
              <p className="text-sm mt-2 text-accent">JPG or PNG, Max size 5MB.</p>
            </div>
          </div>
          <div className="mt-6">
            <div className="mb-2">
              <label htmlFor="name" className="block font-outfit">Full Name</label>
              <input type="text" className="p-2 border-1 border-accentLight block w-full rounded-md mt-1" />
            </div>
            <div className="mb-2">
              <label htmlFor="email" className="block font-outfit">Email Address</label>
              <input type="email" className="p-2 border-1 border-accentLight block w-full rounded-md mt-1" />
            </div>
            <div className="mb-2">
              <label htmlFor="phone" className="block font-outfit">Phone Number</label>
              <input type="tel" className="p-2 border-1 border-accentLight block w-full rounded-md mt-1" />
            </div>
            <div className="mb-2">
              <label htmlFor="bio" className="block font-outfit">Bio</label>
              <textarea name="bio" id="bio" className="p-2 border-1 border-accentLight block w-full rounded-md mt-1 resize-none"></textarea>
            </div>
            <button className="mt-4 flex-center gap-2 btn-primary">
              <IoSave />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
        <div className="p-6 rounded-md bg-white max-md:mt-4">
          <div className="flex-start gap-2">
            <FaGears color="#231e88" size={20} />
            <h1 className="text-xl text-primary font-outfit">Quick Action</h1>
          </div>
          <button className="flex-start gap-2 p-2 rounded-md mt-4 border-1 border-accentLight w-full hover:bg-accentLight cursor-pointer">
            <BiMoon size={20} />
            <span className="font-outfit">Enable Dark Theme</span>
          </button>
          <button className="flex-start gap-2 p-2 rounded-md mt-4 border-1 border-accentLight w-full text-red-500 hover:bg-accentLight cursor-pointer">
            <HiArrowLeftStartOnRectangle size={20} />
            <span className="font-outfit">Sign Out</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Settings