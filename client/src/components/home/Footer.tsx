import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"

const Footer = () => {
  const navigate = useNavigate()
  const year = new Date().getFullYear()

  const toPricing = () => {
    navigate("/pricing")
  }

  const toAbout = () => {
    navigate("/about")
  }

  const toContact = () => {
    navigate("/contact")
  }

  const toTerms = () => {
    navigate("/terms")
  }

  return (
    <footer className="bg-secondary px-6 py-10 z-10">
      <div className="flex-start">
        <img src={logo} className="h-[30px]" />
        <span className="text-xl font-outfit ml-2 text-white">MailDrop</span>
      </div>
      <p className="text-gray-500 text-sm mt-1 font-inter">The future of email marketing is here</p>
      <div className="mt-6 sm:grid sm:grid-cols-3 sm:gap-2">
        <div className="mb-7">
          <p className="text-white mb-1">Links</p>
          <small onClick={toPricing}>Pricing</small>
        </div>
        <div className="mb-7">
          <p className="text-white mb-1">Support</p>
          <small onClick={toAbout}>About Us</small>
          <small onClick={toContact}>Contact Us</small>
        </div>
        <div>
          <p className="text-white mb-1">Legal</p>
          <small onClick={toTerms}>Terms & Condition</small>
          <small>Privacy Policy</small>
        </div>
      </div>
      <hr className="text-gray-500 mt-10" />
      <p className="mt-6 mb-2 text-accent text-sm font-outfit text-center">&copy; {year} MailDrop. All rights reserved</p>
    </footer>
  )
}

export default Footer