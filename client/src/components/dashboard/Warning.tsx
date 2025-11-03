import { PiWarningFill } from "react-icons/pi"

interface PropsType {
  title: string,
  text: string,
  setWarning: React.Dispatch<React.SetStateAction<boolean>>,
  confirmAction: () => void,
}

const Warning = ({ title, text, setWarning, confirmAction }: PropsType) => {
  const cancelWarning = () => {
    setWarning(false)
  }

  return (
    <main className="fixed top-0 bottom-0 left-0 right-0 flex-center bg-black/70 z-50">
      <div className="p-6 bg-white flex-center flex-col w-[90%] sm:w-[400px]">
        <PiWarningFill size={45} className="mb-2" color="#231e88" />
        <h1 className="font-inter text-xl mb-2">{title}</h1>
        <p className="text-sm text-accent mb-2 text-center">{text}</p>
        <div className="flex-center gap-3 mt-1">
          <button onClick={cancelWarning} className="bg-red-400 border-red-400 hover:text-red-400 btn-primary">Cancel</button>
          <button onClick={confirmAction} className="btn-primary">Proceed</button>
        </div>
      </div>
    </main>
  )
}

export default Warning