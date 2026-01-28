import { FaArrowRight } from "react-icons/fa6"
import heroImg from "../../assets/hero.png"
import { useNavigate } from "react-router-dom"
import { BsStarFill } from "react-icons/bs"

const Hero = () => {
  const navigate = useNavigate()

  const toLogin = () => {
    navigate("/login")
  }

  return (
    <section className="bg-gray-50 pt-35 sm:pt-40 pb-30 relative">
      <div className="flex-center backdrop-blur-3xl flex-col px-4 md:px-6">
        <div className="bg-gray-200 border border-gray-300 py-2 px-4 lg:px-6 rounded-full font-open text-[12px] md:text-sm flex-center gap-1 md:gap-2">
          <div className="flex-start gap-2">
            <BsStarFill color="gold" />
            <span>New:</span>
          </div>

          <p>Email marketing platform</p>
        </div>

        <h1 className="text-5xl leading-13 mt-4 lg:text-6xl lg:w-[80%] mx-auto text-center font-outfit">
          Email marketing made <span className="text-primary">simple and secure</span>
        </h1>

        <p className="text-black font-jsans mt-5 max-lg:w-[80%] text-center">
          Design, grow, and manage email campaigns with full control over your audience and delivery
        </p>

        <button
          onClick={toLogin} 
          className="btn-primary mt-6 font-open flex-center gap-3 rounded-full py-3 px-8"
        >
          <span>Get Started</span>
          <FaArrowRight />
        </button>
      </div>

      <div className="flex-center mt-20 px-2">
        <img src={heroImg} alt="" />
      </div>
    </section>
  )
}

export default Hero