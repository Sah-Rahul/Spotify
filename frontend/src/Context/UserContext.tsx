import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";

const server = "http://localhost:3000";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  playlist: string[];
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  isAuth: boolean;
  loginLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  addToPlaylist: (songId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuth, setAuth] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await fetch(`${server}/api/v1/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      toast.success("Registration successful");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    }
  };

  const login = async (email: string, password: string) => {
    setLoginLoading(true);
    try {
      const res = await fetch(`${server}/api/v1/user/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      setUser(data.user);
      setAuth(true);
      toast.success("Login successful!");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
      setUser(null);
      setAuth(false);
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = async () => {
    try {
      const res = await fetch(`${server}/api/v1/user/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Logout failed");

      setUser(null);
      setAuth(false);
      toast.success("Logged out successfully!");
    } catch (err: any) {
      toast.error(err.message || "Logout failed");
    }
  };

  const addToPlaylist = async (songId: string) => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    try {
      const res = await fetch(`${server}/api/v1/user/song/${songId}`, {
        method: "POST",
        credentials: "include",
      });


      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      toast.success(data.message);


      setUser((prev) =>
        prev
          ? {
            ...prev,
            playlist: data.message.includes("Removed")
              ? prev.playlist.filter((id) => id !== songId)
              : [...prev.playlist, songId],
          }
          : prev
      );
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${server}/api/v1/user/me`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data.data);
        setAuth(true);
      } catch {
        setUser(null);
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isAuth,
        loginLoading,
        login,
        logout,
        register,
        addToPlaylist,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserData = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserProvider");
  }
  return context;
};
