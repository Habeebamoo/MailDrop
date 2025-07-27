const NavBar = () => {
  return (
    <div className="flex-center flex-col mt-1 sm:hidden">
      <p className="text-lg mb-2 hover:text-primary cursor-pointer">Home</p>
      <p className="text-lg mb-2 hover:text-primary cursor-pointer">About</p>
      <button className="btn-primary mt-1">Get Started</button>
    </div>
  )
}

export default NavBar