import { BsArrowRight } from "react-icons/bs"
import Header from "../components/home/Header"
import { FaStar } from "react-icons/fa6"
import { FaFolder, FaUser } from "react-icons/fa"
import { TbCurrencyNaira } from "react-icons/tb"
import { IoMdMail } from "react-icons/io"
import Footer from "../components/home/Footer"
import { useNavigate } from "react-router-dom"

const PricingPage = () => {
  const navigate = useNavigate()

  const toLogin = () => {
    navigate("/login")
  }

  return (
    <>
      <Header />
      <main className="bg-bg pt-25 pb-15 min-h-[calc(100vh-4rem)]">
        <h1 className="font-inter text-center text-2xl" data-aos="zoom-in">Choose Your Plan</h1>
        <p className="text-center text-sm text-accent mt-1" data-aos="zoom-in">Start your email marketing journey with our flexible plans</p>
        <div className="mt-6">
          <div className="bg-white border-1 border-bg2 p-8 rounded-xl w-[90%] sm:w-[400px] mx-auto" data-aos="fade-up">
            <div className="flex-start gap-2">
              <FaStar color="#231e88" size={20} />
              <p className="font-inter text-xl">Free</p>
            </div>
            <p className="text-sm text-accent mt-1 font-open">Has everything included for you</p>
            <div className="my-4 flex-start text-accent">
              <TbCurrencyNaira size={40} />
              <h1 className="text-3xl">0.00</h1>
            </div>
            <button 
              onClick={toLogin}
              className="py-2 mt-4 btn-primary w-full flex-center gap-2"
            >
              <p>Start Free</p>
              <BsArrowRight />
            </button>
            <p className="text-sm text-accent mt-3">Features Included</p>
            <div className="flex-between mt-4 p-1">
              <div className="flex-start gap-2 text-sm">
                <FaFolder color="#231e88" />
                <p>Campaigns</p>
              </div>
              <p className="bg-accentLight py-1 px-3 text-[11px] rounded-lg">Unlimited</p>
            </div>
            <div className="flex-between mt-4 p-1">
              <div className="flex-start gap-2 text-sm">
                <FaUser color="#231e88" />
                <p>Subscriber Limits</p>
              </div>
              <p className="bg-accentLight py-1 px-3 text-[11px] rounded-lg">Unlimited</p>
            </div>
            <div className="flex-between mt-4 p-1">
              <div className="flex-start gap-2 text-sm">
                <IoMdMail color="#231e88" />
                <p>Emails</p>
              </div>
              <p className="bg-accentLight py-1 px-3 text-[11px] rounded-lg">Unlimited</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default PricingPage