import { ClipLoader } from "react-spinners"
import googleImg from "../../assets/google.png"

const GoogleLoading = () => {
  return (
    <div className="backdrop-blur-md bg-white/10 z-10 fixed top-0 bottom-0 left-0 right-0 flex-center">
      <div className="bg-white border-1 border-bg2 p-8 rounded-lg w-[90%] sm:w-[400px]">
        <img src={googleImg} className="h-8 mx-auto" />
        <div className="text-accent mt-6 flex-center gap-2">
          <ClipLoader color="rgb(121, 120, 120)" size={13} />
          <h1 className="text-sm">Signing in with google...</h1>
        </div>
      </div>
    </div>
  )
}

export default GoogleLoading