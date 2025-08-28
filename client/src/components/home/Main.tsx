import { FiEdit, FiLink, FiMail, FiUsers } from "react-icons/fi"

const Main = () => {
  return (
    <section className="py-6 px-3 bg-accentXLight border-t-1 border-t-accentLight">
      <div className="flex-center">
        <p className="bg-bg2 font-outfit py-1 px-2 rounded font-open text-sm text-primary">
        <span className="ml-1">Features</span>
        </p>
      </div>
      <p className="text-sm text-center mt-1 mx-auto text-accent w-[80%]">Everything you need to market through emails is provided by the platform</p>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 lg:gap-3 md:gap-3 mt-5 p-2 lg:w-[95%] mx-auto">
        <div className="bg-white p-4 rounded-md mb-4" data-aos="fade-up">
          <div className="bg-primary p-2 rounded-md inline-block">
            <FiEdit color="white" size={25} />
          </div>
          <h1 className="font-open mt-1 text-xl">Campaign Builder</h1>
          <p className="text-accent text-sm mt-1">Create personalized campaigns with ease, add descriptions, upload lead magnets and get a sharable link instantly</p>
        </div>
        <div className="bg-white p-4 rounded-md mb-4" data-aos="fade-up">
          <div className="bg-primary p-2 rounded-md inline-block">
            <FiUsers color="white" size={25} />
          </div>
          <h1 className="font-open mt-1 text-xl">Leads Organization</h1>
          <p className="text-accent text-sm mt-1">Collect, view and manage all your leads, sort by any category and export data for later use</p>
        </div>
        <div className="bg-white p-4 rounded-md mb-4" data-aos="fade-up">
          <div className="bg-primary p-2 rounded-md inline-block">
            <FiLink color="white" size={25} />
          </div>
          <h1 className="font-open mt-1 text-xl">Unique Sharable Links</h1>
          <p className="text-accent text-sm mt-1">Generate campaigns-specific links to share across social media, emails or websites in both text and QR CODE format</p>
        </div>
        <div className="bg-white p-4 rounded-md mb-4" data-aos="fade-up">
          <div className="bg-primary p-2 rounded-md inline-block">
            <FiMail color="white" size={25} />
          </div>
          <h1 className="font-open mt-1 text-xl">Email Marketing</h1>
          <p className="text-accent text-sm mt-1">Send targeted promotional or follow-up emails to your leads directly from your dashboard</p>
        </div>
      </div>
    </section>
  )
}

export default Main