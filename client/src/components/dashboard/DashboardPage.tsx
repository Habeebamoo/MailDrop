import { CgMail } from "react-icons/cg"
import { FaArrowRight, FaRegHandPointer } from "react-icons/fa"
import { FiUsers } from "react-icons/fi"

const DashboardPage = () => {
  return (
    <section className="md:ml-[170px] mt-[50px] px-4 pt-2 pb-25">
      <h1 className="text-2xl text-primary font-inter mt-4">Overview</h1>
      <p className="text-sm text-accent mt-1">Welcome back, Here's what's happening with your email campaigns</p>
      <div className="md:grid md:grid-cols-3 md:gap-2 mt-4">
        <div className="bg-white p-4 rounded-md max-md:mb-3">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Total Campaigns</p>
            <CgMail size={20} color="#231e88" />
          </div>
          <h1 className="font-inter text-xl mt-1">0</h1>
        </div>
        <div className="bg-white p-4 rounded-md max-md:mb-3">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Total Subscribers</p>
            <FiUsers size={18} color="#231e88" />
          </div>
          <h1 className="font-inter text-xl mt-1">0</h1>
        </div>
        <div className="bg-white p-4 rounded-md">
          <div className="flex-between">
            <p className="font-outfit text-sm text-accent">Clicks</p>
            <FaRegHandPointer size={17} color="#231e88" />
          </div>
          <h1 className="font-inter text-xl mt-1">0</h1>
        </div>
      </div>
      <h1 className="text-xl text-primary font-inter mt-6">Recent Campaigns</h1>
      <div className="bg-white rounded-sm mt-2">
        <div className="grid grid-cols-4 gap-1 font-inter text-sm border-b-1 border-b-accentLight py-3 text-center">
          <p>Campaign</p>
          <p>Status</p>
          <p>Subscribers</p>
          <p>Created</p>
        </div>
        <div className="grid grid-cols-4 gap-1 font-inter text-sm py-3 px-2 text-center text-accent">
          <p>Summer Sale 2024</p>
          <div>
            <p className="bg-green-400 px-2 py-1 rounded-md text-white inline">Active</p>
          </div>
          <p>76</p>
          <p>2024-8-24</p>
        </div>
        <div className="grid grid-cols-4 gap-1 font-inter text-sm py-3 px-2 text-center text-accent">
          <p>Affiliate Marketing</p>
          <div>
            <p className="bg-red-400 px-2 py-1 rounded-md text-white inline">Paused</p>
          </div>
          <p>386</p>
          <p>2024-9-20</p>
        </div>
      </div>
    </section>
  )
}

export default DashboardPage
