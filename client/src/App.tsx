import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route
} from "react-router-dom"

import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import NotFoundPage from "./pages/NotFoundPage"

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </>
    )
  )
  return <RouterProvider router={router} />
}

export default App