import logo from "../../assets/logo.png"
import { useUser } from "../../context/UserContext"

const Header = () => {
  const { user } = useUser()

  const getFirstLetterOf = (text: string | undefined) => {
    return text?.charAt(0).toUpperCase()
  }

  return (
    <header className="p-4 bg-white dark:bg-gray-900 dark:border-gray-800 dark:shadow-lg z-40 fixed top-0 left-0 right-0 border-b-1 border-b-accentLight flex-between">
      <div className="flex-start dark:text-primary dark:text-white">
        <img src={logo} className="h-8" />
        <h1 className="text-xl font-outfit ml-1">MailDrop</h1>
      </div>
      <div>
        <div className="h-7 w-7 rounded-full bg-accentLight border-1 border-accent flex-center overflow-hidden text-accent">
          {user?.profile.profilePic ? 
            <img src={user.profile.profilePic} className="object-cover w-full h-full" /> : 
            getFirstLetterOf(user?.name)}
        </div>
      </div>
    </header>
  )
}

export default Header