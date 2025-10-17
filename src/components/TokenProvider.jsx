import { useState, useEffect, createContext } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

export const TokenContext = createContext();

export default function TokenProvider({children}) {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [accessToken, setAccessToken] = useState();

    useEffect(() => {
      const getAccessToken = async () => {
        if (isAuthenticated) {
          const token = await getAccessTokenSilently()
          setAccessToken(token)
        }
      }
      getAccessToken();
    }, [isAuthenticated, getAccessTokenSilently])

    return (
        <TokenContext.Provider value={accessToken}>
            {children}
        </TokenContext.Provider>);
  }