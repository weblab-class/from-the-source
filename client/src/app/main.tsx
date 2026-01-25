import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../styles/index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="21919360500-851itvmeu0jn4010j0p68bt71m7a1ivc.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
)
