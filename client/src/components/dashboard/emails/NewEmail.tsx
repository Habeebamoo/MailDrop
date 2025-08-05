const NewEmail = ({ setActiveTab }: { setActiveTab: React.Dispatch<React.SetStateAction<"dashboard" | "new">> }) => {
  const toDashboard = () => {
    setActiveTab("dashboard")
  }

  return (
    <section className="md:ml-[170px] mt-[57px] px-3 pt-2 pb-25 min-h-[calc(100vh-4rem)]">
      <button onClick={toDashboard} className="btn-primary">Back</button>
    </section>
  )
}

export default NewEmail