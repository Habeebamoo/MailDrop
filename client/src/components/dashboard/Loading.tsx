import logo from "../../assets/logo.png"

const Loading = () => {
  return (
    <main className="fixed top-0 bottom-0 left-0 right-0 flex-center backdrop-blur-md bg-white/10 z-50">
      <img src={logo} className="h-12 animate-ping" />
    </main>
  )
}

export default Loading