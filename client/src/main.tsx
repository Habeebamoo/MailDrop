import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { CampaignIDProvider } from './context/CampaignContext.tsx'

createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <CampaignIDProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </CampaignIDProvider>
  </UserProvider>
)
