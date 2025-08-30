import { createRoot } from 'react-dom/client'
import './index.css'
import { GoogleOAuthProvider} from "@react-oauth/google"
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { CampaignIDProvider } from './context/CampaignContext.tsx'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <UserProvider>
      <CampaignIDProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </CampaignIDProvider>
    </UserProvider>
  </GoogleOAuthProvider>
)
