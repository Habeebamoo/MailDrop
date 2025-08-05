import { useState } from "react"
import Dashboard from "./emails/Dashboard"
import NewEmail from "./emails/NewEmail"

const Emails = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "new">("dashboard")

  return (
    <>
      {activeTab === "dashboard" && <Dashboard setActiveTab={setActiveTab} />}
      {activeTab === "new" && <NewEmail setActiveTab={setActiveTab} />}
    </>
  )
}

export default Emails