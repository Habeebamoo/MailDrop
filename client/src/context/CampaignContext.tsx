import { createContext, useContext, useState, type ReactNode } from "react"

type CampaignID = string

type initCampaignContext = {
  campaignId: CampaignID
  setCampaignId: React.Dispatch<React.SetStateAction<string>>
}

const CampaignIDContext = createContext<initCampaignContext | undefined>(undefined)

export const CampaignIDProvider = ({ children }: { children: ReactNode }) => {
  const [campaignId, setCampaignId] = useState<string>("")

  return (
    <CampaignIDContext.Provider value={{ campaignId, setCampaignId }}>
      {children}
    </CampaignIDContext.Provider>
  )
}

export const useCampaignId = () => {
  const context = useContext(CampaignIDContext)
  if (!context) throw new Error("must be used inside a campaign provider")
  
  return context
}