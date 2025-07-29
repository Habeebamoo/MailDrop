import logo from "../../assets/logo.png"

const Header = () => {
  return (
    <header className="p-4 bg-white z-50 fixed top-0 left-0 right-0 border-b-1 border-b-accentLight flex-between">
      <div className="flex-start">
        <img src={logo} className="h-8" />
        <h1 className="text-primary text-xl font-outfit ml-1">MailDrop</h1>
      </div>
      <div>
        <div className="h-7 w-7 rounded-full bg-accentLight border-1 border-accent flex-center text-white">H</div>
      </div>
    </header>
  )
}

export default Header