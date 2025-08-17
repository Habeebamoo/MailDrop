import { FaCircleQuestion } from "react-icons/fa6"

const Error = ({ 
  title="Unexpected Error", 
  text="An unexpected error occured, please login in again",
  path="/" }: 
  { title?: string, text?: string, path?: string }
) => {
  
  const exitTo = (path: string) => {
    window.location.href = path
  }

  return (
    <main className="fixed top-0 bottom-0 left-0 right-0 flex-center backdrop-blur-md bg-white/10 z-50">
      <div className="p-6 bg-white rounded-sm border-1 border-accentLight flex-center flex-col">
        <FaCircleQuestion size={40} className="mb-2" color="#231e88" />
        <h1 className="font-inter text-xl mb-2">{title}</h1>
        <p className="text-sm text-accent mb-2">{text}</p>
        <button onClick={() => exitTo(path)} className="btn-primary">Go Back</button>
      </div>
    </main>
  )
}

export default Error