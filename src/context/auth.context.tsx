import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from "react";

type ContextProviderProps = {
  children: React.ReactNode;
};
// Define the type for the auth state
export interface AuthState {
  token: string | null;
}

// Define the context type
interface AuthContextType {
  auth: AuthState;
  setAuth: Dispatch<SetStateAction<AuthState>>;
  persist: boolean;
  setPersist: Dispatch<SetStateAction<boolean>>;
}
export const AuthContext = createContext<AuthContextType>({
  auth: { token: null },
  setAuth: () => {},
  persist: false,
  setPersist: () => {},
});

export const AuthContextProvider = ({ children }: ContextProviderProps) => {
  const [auth, setAuth] = useState<AuthState>({
    token: localStorage.getItem("token"),
  });
  const [persist, setPersist] = useState(
    Boolean(JSON.parse(localStorage.getItem("persist_auth") || "false")) ||
      false
  );

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        persist,
        setPersist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthState() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthState must be used within a GloabalProvider");
  }
  return context;
}
