import Footer from "../components/home/Footer"
import Header from "../components/home/Header"

const AboutPage = () => {
  return (
    <>
      <Header />
      <main className="bg-bg pt-25 pb-15 min-h-[calc(100vh-4rem)]">
        <div className="flex-center mt-1">
          <p className="bg-bg2 font-outfit py-1 px-2 rounded font-open text-sm text-primary">
          <span className="ml-1">About MailDrop</span>
          </p>
        </div>
        <h1 className="text-center font-inter text-2xl mt-2">Transforming Email Marketing</h1>
        <p className="text-sm text-center mt-1 mx-auto text-accent w-[80%]">The future of email marketing is here</p>
        <div className="mt-6">
          <div className="bg-white border-1 border-bg2 p-8 rounded-xl w-[90%] sm:w-[400px] mx-auto">
            <h1 className="text-xl text-center font-inter">About MailDrop</h1>
            <p className="text-sm text-accent text-center mt-4 font-open"><b>MailDrop</b> was born out of a simple idea: communicating with people should feel effortless. Too often, email platforms feels heavy, complicated, expensive or built only for big companies with big budgets. We wanted something different - something lightweight, personal and powerful enough to grow with you.</p>

            <p className="text-sm text-accent text-center mt-4 font-open">What started as a small project quickly grew into a platform that helps creators, teams and businesses connect with thier audience in a way that feels human. Every feature in MailDrop was built with simplicity and trust in mind, from secure user managment to sending promotional emails.</p>

            <p className="text-sm text-accent text-center mt-4 font-open">At its heart, MailDrop is about building meaningful connections, not just sending emails.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default AboutPage