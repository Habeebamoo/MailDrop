import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from "react-router-dom"

import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import NotFoundPage from "./pages/NotFoundPage"
import Dashboard from "./pages/Dashboard"
import DashboardPage from "./components/dashboard/DashboardPage"
import Campaigns from "./components/dashboard/Campaigns"
import Settings from "./components/dashboard/Settings"
import Emails from "./components/dashboard/Emails"
import ForgotPage from "./pages/ForgotPage"
import ResetPage from "./pages/ResetPage"
import Error from "./components/dashboard/Error"
import { ToastContainer } from "react-toastify"
import "react-toastify/ReactToastify.css"
import Aos from "aos"
import "aos/dist/aos.css"
import SubscriberPage from "./pages/SubscriberPage"
import { useEffect } from "react"
import VerificationPage from "./pages/VerificationPage"
import Unsubscribe from "./pages/unsubscribe/Page"
import PricingPage from "./pages/PricingPage"
import AboutPage from "./pages/AboutPage"
import ContactPage from "./pages/ContactPage"
import TermsPage from "./pages/TermsPage"

const App = () => { 
  useEffect(() => {
    Aos.init({
      duration: 1000,
    })
  }, []) 
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/verify" element={<VerificationPage />} />
        <Route path="/dashboard" element={<Dashboard />} errorElement={<Error />} >
          <Route path="home" element={<DashboardPage />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="email" element={<Emails />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/forgot" element={<ForgotPage />} />
        <Route path="/reset" element={<ResetPage />} />
        <Route path="/campaign" element={<SubscriberPage />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
        <Route path="*" element={<NotFoundPage />} />
      </>
    )
  )
  
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" />
    </>
  )
}

export default App