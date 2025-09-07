import { MdDateRange } from "react-icons/md"
import Footer from "../components/home/Footer"
import Header from "../components/home/Header"

const TermsPage = () => {
  return (
    <>
      <Header />
      <main className="bg-bg pt-25 pb-15 min-h-[calc(100vh-4rem)]">
        <h1 className="text-center font-inter text-2xl mt-2" data-aos="zoom-in">Terms of Service</h1>
        <p className="text-sm text-center mt-1 mx-auto text-accent w-[80%]" data-aos="zoom-in">Please read the Terms of Services before making using MailDrop's email marketing services</p>
        <div className="flex-center gap-1 text-accent mt-2" data-aos="zoom-in">
          <MdDateRange />
          <p className="text-[10px]">Last Updated: Sep 07, 2025</p>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 sm:gap-4 w-[90%] mx-auto">
          <div className="bg-white border-1 border-bg2 p-6 rounded-xl w-[90%] sm:w-[400px] max-sm:mt-4 mx-auto" data-aos="fade-up">
            <div className="flex-start gap-3 mb-4">
              <div className="text-white text-sm bg-primary h-6 w-6 rounded-full flex-center font-open">1</div>
              <h1 className="font-inter text-lg">Acceptance of Terms</h1>
            </div>
            <p className="text-sm text-accent font-open">By signing up and using MailDrop, you agree to be bounded by these terms. If you do not agree, you may not use our platform.</p>
          </div>

          <div className="bg-white border-1 border-bg2 p-6 rounded-xl w-[90%] sm:w-[400px] max-sm:mt-4 mx-auto" data-aos="fade-up">
            <div className="flex-start gap-3 mb-4">
              <div className="text-white text-sm bg-primary h-6 w-6 rounded-full flex-center font-open">2</div>
              <h1 className="font-inter text-lg">Eligibility</h1>
            </div>
            <p className="text-sm text-accent font-open">You must be at least 16 years old or have a parental consent to use MailDrop. By creating an account, you confirm that you meet this requirement.</p>
          </div>

          <div className="bg-white border-1 border-bg2 p-6 rounded-xl w-[90%] sm:w-[400px] max-sm:mt-4 mx-auto" data-aos="fade-up">
            <div className="flex-start gap-3 mb-4">
              <div className="text-white text-sm bg-primary h-6 w-6 rounded-full flex-center font-open">3</div>
              <h1 className="font-inter text-lg">User Responsibilities</h1>
            </div>
            <p className="text-sm text-accent font-open">You are responsible for maintaining the confidentiality of your account.</p>
            <p className="text-sm text-accent font-open mt-2">You agree not to use MailDrop for unlawful. harmful, or abusive activities.</p>
            <p className="text-sm text-accent font-open mt-2">You agree to provide accurate and up-to-date information when required.</p>
          </div>

          <div className="bg-white border-1 border-bg2 p-6 rounded-xl w-[90%] sm:w-[400px] max-sm:mt-4 mx-auto" data-aos="fade-up">
            <div className="flex-start gap-3 mb-4">
              <div className="text-white text-sm bg-primary h-6 w-6 rounded-full flex-center font-open">4</div>
              <h1 className="font-inter text-lg">Service Availablility</h1>
            </div>
            <p className="text-sm text-accent font-open">We strive to keep MailDrop accessible at all times, but we do not guarantee uninterrupted service. Maintenance, upgrades or unforseen issues may affect availabilty.</p>
          </div>


          <div className="bg-white border-1 border-bg2 p-6 rounded-xl w-[90%] sm:w-[400px] max-sm:mt-4 mx-auto" data-aos="fade-up">
            <div className="flex-start gap-3 mb-4">
              <div className="text-white text-sm bg-primary h-6 w-6 rounded-full flex-center font-open">5</div>
              <h1 className="font-inter text-lg">Subscriber's Privacy</h1>
            </div>
            <p className="text-sm text-accent font-open">MailDrop values the privacy of subscribers who receive communications through our platform. Subscribers data (such as names, emails) will never be sold or shared with third parties without explicit consent.</p>
            <p className="text-sm text-accent font-open mt-2">Campaign subscribers have the right to opt out of communications at any time using the unsubscribe feature, and thier choice will be respected immediately.</p>
          </div>


          <div className="bg-white border-1 border-bg2 p-6 rounded-xl w-[90%] sm:w-[400px] max-sm:mt-4 mx-auto" data-aos="fade-up">
            <div className="flex-start gap-3 mb-4">
              <div className="text-white text-sm bg-primary h-6 w-6 rounded-full flex-center font-open">6</div>
              <h1 className="font-inter text-lg">Termination</h1>
            </div>
            <p className="text-sm text-accent font-open">We may suspend or terminate your account if you violate these terms.</p>
            <p className="text-sm text-accent font-open mt-2">These Terms are governed by the laws of Nigeria</p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}

export default TermsPage