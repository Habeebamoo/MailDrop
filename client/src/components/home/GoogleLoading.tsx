import { useEffect, useState } from "react";
import Spinner from "./Spinner"

const GoogleLoading = () => {
  const textArr = ["Exchanging authorization token...", "Connecting your google account...", "Making request to server..."];
  const [infoText, setInfoText] = useState<string>("")

  useEffect(() => {
    const interval = setInterval(() => {
      setInfoText(textArr[Math.floor(Math.random() * textArr.length)])
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="backdrop-blur-md bg-white/10 z-10 fixed top-0 bottom-0 left-0 right-0 flex-center">
      <div className="bg-white border-1 border-bg2 p-8 rounded-2xl w-[90%] sm:w-[400px]">
        <div className="flex-center">
          <Spinner size={30} color="primary" />
        </div>
        <h1 className="text-accent font-inter text-lg text-center mt-6">Connecting with Google</h1>
        <p className="text-accent text-center font-outfit text-[12px]">{infoText}</p>
      </div>
    </div>
  )
}

export default GoogleLoading