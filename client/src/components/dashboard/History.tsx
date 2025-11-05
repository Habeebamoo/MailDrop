import { BsCircleFill } from "react-icons/bs"
import { useTheme } from "../../context/ThemeContext"
import { GoHistory, GoPulse } from "react-icons/go"

const History = ({ title, backupText, history }: { title: string, backupText: string, history: any[] }) => {
  const { theme } = useTheme()

  const getBulletColor = (type: string) => {
    if (type === "campaign") {
      return <BsCircleFill size={8} color="green" />
    } else if (type === "email") {
      return <BsCircleFill size={8} color="blue" />
    } else if (type === "lead") {
      return <BsCircleFill size={8} color="orange" />
    } else {
      return <BsCircleFill size={8} color="purple" />
    }
  } 

  return (
    <>
      <div className="bg-white p-5 dark:bg-gray-900 border-1 border-bg2 dark:border-gray-800 rounded-lg mt-6">
        <div className="flex-start gap-2">
          <GoPulse color={theme == "light" ? "#231e88" : "rgb(121, 120, 120)"} />
          <h1 className="font-inter dark:text-accent">{title}</h1>
        </div>
        <div className="mt-5">
          {history.map((obj) => {
            return (
              <div className="flex-start gap-3 mb-2">
                <div>{getBulletColor(obj.type)}</div>
                <div>
                  <h1 className="text-sm font-open dark:text-white">{obj.name}</h1>
                  <p className="text-accent text-[10px]">{obj.createdAt}</p>
                </div>
              </div>
            )
          })}
        </div>
        {history.length == 0 &&
          <div className="p-14 mt-2 flex-center flex-col gap-4 text-center">
            <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-lg">
              <GoHistory size={40} color="#6964c9ff" />
            </div>
            <p className="text-accent font-open text-sm">{backupText}</p>
          </div>
        }
      </div>
    </>
  )
}

export default History