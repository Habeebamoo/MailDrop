import { FaArrowLeft } from "react-icons/fa"
import Footer from "../components/home/Footer"
import { PiWarningFill } from "react-icons/pi"
import { useNavigate } from "react-router-dom"

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <section>
      <PiWarningFill size={50} color="#231e88" className="mt-[100px] lg:mt-[150px] mx-auto" />
      <h1 className="text-2xl text-primary text-center">404 Page Not Found</h1>
      <p className="text-sm text-accent text-center mt-1">Oops, this page was not found or it has been temporary moved </p>
      <button onClick={() => navigate("/")} className="flex-center px-6 py-2 btn-primary mx-auto mt-2 mb-10">
        <FaArrowLeft />
        <span className="ml-2">Go Back</span>
      </button>
      <Footer />
    </section>
  )
}

export default NotFoundPage