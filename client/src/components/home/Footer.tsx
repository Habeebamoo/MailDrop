import logo from "../../assets/logo.png"

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-secondary p-6">
      <div className="flex-start">
        <img src={logo} className="h-[30px]" />
        <span className="text-xl font-outfit ml-2 text-white">MailDrop</span>
      </div>
      <p className="text-accent mt-1">The future of email marketing is here</p>
      <div className="mt-4 sm:mt-6 sm:grid sm:grid-cols-3 sm:gap-2">
        <div className="mb-3">
          <p className="text-white mb-1">Product</p>
          <small>Features</small>
          <small>Pricing</small>
          <small>Security</small>
          <small>Integrations</small>
        </div>
        <div className="mb-3">
          <p className="text-white mb-1">Company</p>
          <small>About</small>
          <small>Blog</small>
          <small>Careers</small>
          <small>Contact</small>
        </div>
        <div>
          <p className="text-white mb-1">Support</p>
          <small>Help Center</small>
          <small>Documentation</small>
          <small>Status</small>
          <small>Privacy</small>
        </div>
      </div>
      <p className="mt-8 mb-2 text-accent font-outfit text-center">&copy; {year} MailDrop. All rights reserved</p>
    </footer>
  )
}

export default Footer