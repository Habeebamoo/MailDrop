import { FaStar } from "react-icons/fa"
import { FaArrowRight } from "react-icons/fa6"
import heroImg from "../../assets/hero.png"

const Hero = () => {
  return (
    <section className="pt-[100px] pb-5 bg-bg px-2">
      <div className="sm:flex-between sm:w-[80%] mx-auto">
        <div>
          <div className="max-sm:flex-center sm:flex-start">
            <p className="bg-bg2 font-outfit flex-start py-1 px-2 rounded font-open text-sm text-primary">
            <FaStar color="gold" />
            <span className="ml-1">New: Email Management Platform</span>
            </p>
          </div>
          <h1 className="font-inter text-primary text-3xl max-sm:text-center mt-3">Email Made Simple & Secure</h1>
          <p className="max-sm:text-center text-sm max-sm:mt-3 sm:mt-1 text-accent">
            Experience the future of email with MailDrop. Intelligent organization, bulletproof security and lightning-fast perfomance in one beautiful package
          </p>
          <button className="max-sm:mx-auto max-sm:mt-4 sm:mt-2 px-4 btn-primary flex-center">
            <span className="mr-2">Start Free Trail</span>
            <FaArrowRight size={14} />
          </button>
        </div>
        <div className="max-sm:mt-4">
          <div className="flex-center">
            <img src={heroImg} className="max-sm:h-[350px] sm:h-[300px]" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero