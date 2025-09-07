import { IoMdMail } from "react-icons/io"
import Footer from "../components/home/Footer"
import Header from "../components/home/Header"
import { FaWhatsapp } from "react-icons/fa"

const ContactPage = () => {
  return (
    <>
      <Header />
      <main className="bg-bg pt-25 pb-15 min-h-[calc(100vh-4rem)]">
        <h1 className="text-center font-inter text-2xl mt-2" data-aos="zoom-in">Get in Touch</h1>
        <p className="text-sm text-center mt-1 mx-auto text-accent w-[80%]" data-aos="zoom-in">Have a question about our platform? Drop us a message.</p>
        <div className="mt-6">
          <div className="bg-white border-1 border-bg2 p-6 rounded-xl w-[90%] sm:w-[400px] mx-auto" data-aos="fade-up">
            <div className="bg-primary p-2 rounded-lg text-white inline-block">
              <IoMdMail size={20} />
            </div>
            <h1 className="font-inter text-lg">Email Support</h1>
            <input 
              type="text" 
              value="habeebamoo08@gmail.com" 
              className="bg-bg p-2 w-full border-1 border-accentLight rounded-lg text-sm font-outfit mt-2"
              disabled 
            />
            <p className="text-[12px] text-accent font-outfit mt-2">Get help by email. We typically respond within 48 hours</p>
          </div>
          <div className="bg-white border-1 border-bg2 p-6 rounded-xl w-[90%] sm:w-[400px] mx-auto mt-4" data-aos="fade-up">
            <div className="bg-green-400 p-2 rounded-lg text-white inline-block">
              <FaWhatsapp size={20} />
            </div>
            <h1 className="font-inter text-lg">WhatsApp</h1>
            <input 
              type="text" 
              value="+2348127091476" 
              className="bg-bg p-2 w-full border-1 border-accentLight rounded-lg text-sm font-outfit mt-2"
              disabled 
            />
            <p className="text-[12px] text-accent font-outfit mt-2">Chat with us directly on whatsapp for immediate assistance</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ContactPage