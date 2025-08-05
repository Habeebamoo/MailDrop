import { useNavigate } from "react-router-dom"

const ForgotPage = () => {
  const navigate = useNavigate()

  const handleSubmit = () => {
    
  }

  const toLogin = () => {
    navigate("/login")
  }

  return (
    <main className="flex-center h-[100vh] bg-bg">
      <section className="bg-white p-8 rounded-sm w-[90%] sm:w-[400px]">
        <h1 className="text-xl font-outfit text-primary text-center">Forgot Password</h1>
        <p className="text-sm text-accent text-center">Submit your email address in order to recover your account</p>
        <form className="mt-5">
          <div>
            <label className="font-inter mb-1 block" htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              className="block py-2 px-3 border-1 w-full text-accent rounded-md border-accentLight placeholder:text-sm font-outfit" 
              placeholder="Enter your Email Address"
              required
            />
          </div>
          <button onClick={handleSubmit} className="py-2 btn-primary w-full mt-4">Submit</button>
          <p onClick={toLogin} className="text-center text-sm text-accent mt-4">
            <span className="text-primary cursor-pointer font-outfit">Back to login</span>
          </p>
        </form>
      </section>
    </main>
  )
}

export default ForgotPage