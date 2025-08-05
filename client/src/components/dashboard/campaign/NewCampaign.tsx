const NewCampaign = ({ setActiveTab }: { setActiveTab: React.Dispatch<React.SetStateAction<"campaigns" | "new" | "leads">>
}) => {
  const allCampaigns = () => {
    setActiveTab("campaigns")
  }

  return (
    <>
      <section className="md:ml-[170px] mt-[57px] px-3 pt-2 pb-25 min-h-[calc(100vh-4rem)]">
        <button onClick={allCampaigns} className="btn-primary">Back</button>
      </section>
    </>
  )
}

export default NewCampaign