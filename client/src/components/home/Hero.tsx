import { FaStar } from "react-icons/fa"
import { FaArrowRight } from "react-icons/fa6"
import heroImg from "../../assets/hero.png"
import { useNavigate } from "react-router-dom"

const Hero = () => {
  const navigate = useNavigate()

  const toLogin = () => {
    navigate("/login")
  }

  return (
    <section className="pt-[100px] pb-6 bg-bg px-2">
      <div className="lg:grid lg:grid-cols-2 lg:gap-2 lg:w-[80%] mx-auto">
        <div className="lg:mt-10 max-lg:px-4">
          <div className="flex-center sm:flex-start">
            <p className="bg-bg2 font-outfit max-sm:flex-center flex-start py-1 px-2 rounded font-open text-sm text-primary">
              <FaStar color="gold" />
              <span className="ml-1">New: Email Marketing Platform</span>
            </p>
          </div>
          <h1 data-aos="zoom-in" className="font-inter text-primary text-3xl mt-4 max-sm:text-center">Email Marketing Made Simple & Secure</h1>
          <p data-aos="zoom-in" className="text-sm mt-2 text-accent max-sm:text-center font-inter">
            Experience the future of email marketing with MailDrop. Intelligent organization, bulletproof security and lightning-fast perfomance in one beautiful package
          </p>
          <button data-aos="slide-up" onClick={toLogin} className="max-md:py-2 mt-4 text-sm px-4 btn-primary flex-center max-sm:mx-auto">
            <span className="mr-2">Get Started</span>
            <FaArrowRight size={14} />
          </button>
        </div>
        <div className="max-sm:my-22 lg:ml-5">
          <div className="flex-center" data-aos="zoom-in">
            <img src={heroImg} className="max-lg:h-[250px] lg:h-[250px]" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero