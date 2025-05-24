import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import { useAuth0 } from '@auth0/auth0-react'

function App() {
  const [count, setCount] = useState(0)


  const { loginWithRedirect, logout, isAuthenticated, user, isLoading } = useAuth0()


  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React + Auth0</h1>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

        {/* Auth0 Actions */}
        {!isAuthenticated ? (
          <button onClick={() => loginWithRedirect()}>Se connecter</button>
        ) : (
          <>
            <button onClick={() => logout({ returnTo: window.location.origin })}>
              Se déconnecter
            </button>
            <p>Bienvenue, {user.name}</p>
          </>
        )}

        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
