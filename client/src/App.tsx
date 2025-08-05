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

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} >
          <Route path="home" element={<DashboardPage />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="email" element={<Emails />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/forgot" element={<ForgotPage />} />
        <Route path="/reset" element={<ResetPage />} />
        <Route path="/campaign" />
        <Route path="*" element={<NotFoundPage />} />
      </>
    )
  )
  return <RouterProvider router={router} />
}

export default App