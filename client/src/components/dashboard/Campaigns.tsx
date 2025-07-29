import { SlArrowRight } from "react-icons/sl"

const Campaigns = () => {
  return (
    <section className="md:ml-[170px] mt-[50px] px-3 pt-2 pb-25">
      <h1 className="text-xl text-primary font-inter mt-3">Campaigns</h1>
      <p className="text-sm text-accent mb-4">Create and manage your email campaigns</p>
      <div className="bg-white rounded-sm mt-2">
        <div className="grid grid-cols-4 gap-1 font-inter text-sm border-b-1 border-b-accentLight py-3 text-center">
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
          <div className="flex-center cursor-pointer">
            <SlArrowRight />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1 font-inter text-sm py-3 px-2 text-center text-accent">
          <p>Affiliate Marketing</p>
          <div>
            <p className="bg-red-400 px-2 py-1 rounded-md text-white inline">Paused</p>
          </div>
          <p>2024-9-20</p>
          <div className="flex-center cursor-pointer">
            <SlArrowRight />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Campaigns