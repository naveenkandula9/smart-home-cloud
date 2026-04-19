import { createContext, useContext, useEffect, useMemo, useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import {
  clearStoredToken,
  fetchCurrentUser,
  getStoredToken,
  loginUser,
  persistToken,
  registerUser,
} from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const existingToken = getStoredToken();

      if (!existingToken) {
        if (isMounted) {
          setIsBootstrapping(false);
        }
        return;
      }

      try {
        persistToken(existingToken);
        const response = await fetchCurrentUser();

        if (!isMounted) {
          return;
        }

        setToken(existingToken);
        setUser(response.user);
      } catch (_error) {
        if (!isMounted) {
          return;
        }

        clearStoredToken();
        setToken("");
        setUser(null);
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const authenticate = async (action, payload) => {
    const response = await action(payload);
    persistToken(response.token);
    setToken(response.token);
    setUser(response.user);
    return response.user;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isBootstrapping,
      isAuthenticated: Boolean(user && token),
      login: (payload) => authenticate(loginUser, payload),
      register: (payload) => authenticate(registerUser, payload),
      logout: () => {
        clearStoredToken();
        setToken("");
        setUser(null);
      },
    }),
    [isBootstrapping, token, user]
  );

  if (isBootstrapping) {
    return <LoadingScreen />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
};
