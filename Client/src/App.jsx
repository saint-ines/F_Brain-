import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Se connecter</button>
      ) : (
        <>
          <h2>Bonjour {user.name}</h2>
          <button onClick={() => logout({ returnTo: window.location.origin })}>Se déconnecter</button>
        </>
      )}
    </div>
  );
}
