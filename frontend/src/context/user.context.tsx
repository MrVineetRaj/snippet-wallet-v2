import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";
import { IUser } from "../utils/interfaces";
import { PlatformUserRoles } from "../utils/constants";
const BACKEND_URL = `${
  import.meta.env.VITE_PUBLIC_BACKEND_URL as string
}/api/v1/user`;

interface UserContextType {
  user: IUser | null;
  isSignedIn: boolean;
  loading: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  fetchUser: () => Promise<void>;
  signOut: () => void;
  signIn: ({ email, password }: { email: string; password: string }) => void;
  signUp: ({
    fullname,
    email,
    password,
  }: {
    fullname: string;
    email: string;
    password: string;
  }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    console.log(BACKEND_URL);
    try {
      const response = await axios.get(`${BACKEND_URL}`, {
        withCredentials: true,
      });
      setUser(response.data.data);
      setIsSignedIn(true);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(
          err.response?.data.message || "An error occurred while fetching user"
        );
      }
      throw new Error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`${BACKEND_URL}/logout`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(null);
        setIsSignedIn(false);
        setError(null);
      }
      console.log(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data.message || "An error occurred while signing out"
        );
      }
      throw new Error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const signIn = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          `${BACKEND_URL}/login`,
          {
            email: email,
            password: password,
          },
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setUser(response.data.data);
          setIsSignedIn(true);
          setError(null);
        } else {
          setIsSignedIn(false);
          setError("Invalid credentials");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data.message || "An error occurred");
        }
        throw new Error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signUp = useCallback(
    async ({
      fullname,
      email,
      password,
    }: {
      fullname: string;
      email: string;
      password: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          `${BACKEND_URL}/register`,
          {
            fullname: fullname,
            email: email,
            password: password,
            role: PlatformUserRoles.ADMIN,
          },
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setUser(response.data.data);
          setIsSignedIn(true);
          setError(null);
        } else {
          setIsSignedIn(false);
          setError("Invalid credentials");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data.message || "An error occurred");
        } else {
          throw new Error("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
        setUser(null);
        setIsSignedIn(true);
      }
    },
    []
  );

  return (
    <UserContext.Provider
      value={{
        user,
        isSignedIn,
        loading,
        error,
        fetchUser,
        signOut,
        setError,
        signIn,
        signUp,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { useUser, UserContext };
export default UserProvider;
