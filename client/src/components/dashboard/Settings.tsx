import { BiCamera, BiMoon } from "react-icons/bi"
import { FaGears } from "react-icons/fa6"
import { FiUser } from "react-icons/fi"
import { HiArrowLeftStartOnRectangle } from "react-icons/hi2"
import { IoSave } from "react-icons/io5"
import { useTheme } from "../../context/ThemeContext"
import { FaSun } from "react-icons/fa"
import { useUser } from "../../context/UserContext"
import React, { useState } from "react"
import Loading from "./Loading"
import { toast } from "react-toastify"

type FormData = {
  file: File | string,
  name: string,
  email: string,
  bio: string
}

const Settings = () => {
  const { user } = useUser()
  const [form, setForm] = useState<FormData>({
    file: user!.profile.profilePic ?? "",
    name: user!.name ?? "",
    email: user!.email ?? "",
    bio: user!.profile.bio ?? ""
  })
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const { theme, setTheme } = useTheme()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({...prev, file: file}))
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleTheme = () => {
    if (theme == "light") {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const data = new FormData()
    data.append("name", form.name)
    data.append("email", form.email)
    data.append("bio", form.bio)
    data.append("image", form.file)

    try {
      const res = await fetch("https://maildrop-znoo.onrender.com/api/user/profile", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-API-KEY": import.meta.env.VITE_X_API_KEY
        }
      })

      const response = await res.json()

      if (res.ok) {
        toast.success(response.message)
      } else {
        toast.error(response.error)
      }
    } catch (err) {
        toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="md:ml-[170px] mt-[57px] px-3 pt-2 pb-25 min-h-[calc(100vh-4rem)]">
      {loading && <Loading />}
      <h1 className="text-xl text-primary dark:text-white font-inter mt-4">Settings</h1>
      <p className="text-sm text-accent mb-6">Manage your account settings and preference</p>
      <div className="md:grid md:grid-cols-2 gap-2 items-start">
        <form onSubmit={submitProfile} className="p-6 rounded-md bg-white dark:bg-gray-900 dark:border-1 dark:border-gray-800 text-primary dark:text-white">
          <div className="flex-start gap-2">
            <FiUser size={20} />
            <h1 className="text-xl font-outfit">Profile Information</h1>
          </div>
          <p className="text-sm text-accent dark:text-accentLight">Update your personal information and profile details</p>

          <div className="mt-6 flex-start gap-8 px-4">
            <div className="h-18 w-18 bg-accentXLight border-1 border-accentLight rounded-full flex-center overflow-hidden">
              {
                preview ? (
                  <img src={preview} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-3xl">+</span>
                )
              }
            </div>
            <div>
              <label 
                htmlFor="file-upload"
                className="flex-center gap-2 py-1 px-3 border-1 border-accentLight rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-accent cursor-pointer">
                <BiCamera />
                <span className="font-outfit">Change Photo</span>
              </label>
              <p className="text-sm mt-2 text-accent dark:text-accentLight">JPG or PNG, Max size 5MB.</p>
              <input 
                type="file"
                id="file-upload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2">
              <label htmlFor="name" className="block font-outfit text-black dark:text-accentLight">Full Name</label>
              <input 
                type="text" 
                className="text-black dark:text-white py-2 px-3 border-1 border-accentLight block w-full rounded-md mt-1 dark:bg-gray-800 dark:border-gray-700"
                value={form.name}
                onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="email" className="block font-outfit text-black dark:text-accentLight">Email Address</label>
              <input 
                type="email" 
                className="text-black dark:text-white py-2 px-3 border-1 border-accentLight block w-full rounded-md mt-1 dark:bg-gray-800 dark:border-gray-700" 
                value={form.email}
                onChange={(e) => setForm(prev => ({...prev, email: e.target.value}))}
                required
              />
            </div>
            <div className="mb-2">
              <label htmlFor="bio" className="block font-outfit text-black dark:text-accentLight">Bio</label>
              <textarea 
                name="bio" 
                rows={4} id="bio" 
                className="text-black dark:text-white py-2 px-3 border-1 border-accentLight block w-full rounded-md mt-1 resize-none dark:bg-gray-800 dark:border-gray-700"
                value={form.bio}
                onChange={(e) => setForm(prev => ({...prev, bio: e.target.value}))}
                required
              ></textarea>
            </div>
            <button className="mt-4 flex-center gap-2 btn-primary">
              <IoSave />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
        <div className="p-6 rounded-md bg-white dark:bg-gray-900 dark:border-1 dark:border-gray-800 max-md:mt-4">
          <div className="flex-start gap-2 text-primary dark:text-white">
            <FaGears size={20} />
            <h1 className="text-xl font-outfit">Quick Action</h1>
          </div>
          <button 
            onClick={handleTheme} 
            className="flex-start gap-2 p-2 rounded-md mt-4 border-1 bg-black text-white border-black hover:bg-transparent hover:text-black dark:bg-white dark:text-black dark:border-white dark:hover:text-white cursor-pointer">
            {theme == "light" ? <BiMoon size={20} /> : <FaSun size={20} />}
            <span className="font-outfit">Enable {theme == "light" ? "Dark" : "Light"} Theme</span>
          </button>
          <button 
            className="flex-start gap-2 p-2 rounded-md mt-4 border-1 bg-red-500 text-white border-red-500 hover:bg-transparent hover:text-red-500 cursor-pointer"
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