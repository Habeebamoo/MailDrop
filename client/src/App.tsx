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

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} >
          <Route path="home" element={<DashboardPage />} />
          <Route path="campaigns" element={<Campaigns />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </>
    )
  )
  return <RouterProvider router={router} />
}

export default App