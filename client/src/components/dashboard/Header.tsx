import logo from "../../assets/logo.png"

const Header = () => {
  return (
    <header className="p-3 bg-white z-2">
      <div className="flex-start">
        <img src={logo} className="h-5" />
        <h1 className="text-primary text-xl font-outfit ml-1">MailDrop</h1>
      </div>
    </header>
  )
}

export default Header