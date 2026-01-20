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
    <section className="bg-gray-50 pt-35 pb-30 relative">
      <img src={heroImg} className="mx-auto" />

      <div className="flex-center backdrop-blur-3xl absolute top-0 left-0 right-0 bottom-0 flex-col px-4 md:px-6">
        <div className="bg-gray-200 border border-gray-300 py-2 px-4 lg:px-20 rounded-full font-open text-[12px] md:text-sm flex-center gap-1 md:gap-2">
          <div className="flex-start gap-2">
            <BsStarFill color="gold" />
            <span>New:</span>
          </div>

          <p>Email marketing platform</p>
        </div>

        <h1 className="text-4xl mt-6 md:text-5xl lg:text-6xl text-center font-jsans">
          Email marketing made <span className="text-primary">simple and secure</span>
        </h1>

        <p className="text-black font-outfit mt-4 max-lg:w-[80%] text-[13px] sm:text-[14px] md:text-[16px] text-center">
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
    </section>
  )
}

export default Hero