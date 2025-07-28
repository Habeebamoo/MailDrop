import logo from "../../assets/logo.png"

const Header = () => {
  return (
    <header className="p-3 bg-white z-50 fixed top-0 left-0 right-0 border-b-1 border-b-accentLight">
      <div className="flex-start">
        <img src={logo} className="h-5" />
        <h1 className="text-primary text-xl font-outfit ml-1">MailDrop</h1>
      </div>
    </header>
  )
}

export default Header