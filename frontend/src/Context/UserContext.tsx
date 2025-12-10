import { createContext, useContext, useState, type ReactNode } from "react";

const server = "http://localhost:3000";

export interface User {
  _Id: string;
  name: string;
  email: string;
  role: string;
  playlist: string;
}

interface UserContextType {
  user: User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUserData = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserData must be userd within a UserProvider");
  }
  return context;
};
