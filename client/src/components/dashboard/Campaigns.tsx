import { useState } from "react"
import Dashboard from "./campaign/Dashboard"
import NewCampaign from "./campaign/NewCampaign"
import Campaign from "./campaign/Campaign"

const Campaigns = () => {
  const [activeTab, setActiveTab] = useState<"campaigns" | "new" | "leads">("campaigns")
  
  return (
    <>
      {activeTab === "campaigns" && <Dashboard setActiveTab={setActiveTab} />}
      {activeTab === "new" && <NewCampaign setActiveTab={setActiveTab} />}
      {activeTab === "leads" && <Campaign setActiveTab={setActiveTab} />}
    </>
  )
}

export default Campaigns