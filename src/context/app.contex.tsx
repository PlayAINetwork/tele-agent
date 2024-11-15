import React, { createContext, useContext, useState, useMemo } from "react";

interface AppContextType {
  hideSidebar: boolean;
  sidebarMenu: string;
  showTipAgent:boolean;

  setHideSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarMenu: React.Dispatch<React.SetStateAction<string>>;
  setsTipAgent: React.Dispatch<React.SetStateAction<boolean>>;

}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [hideSidebar, setHideSidebar] = useState(false);
  const [sidebarMenu, setSidebarMenu] = useState("globel");
  const [showTipAgent, setsTipAgent] = useState(false);

  const value = useMemo(
    () => ({ hideSidebar,sidebarMenu,showTipAgent, setHideSidebar,setSidebarMenu,setsTipAgent }),
    [hideSidebar,sidebarMenu,showTipAgent, setHideSidebar,setSidebarMenu,setsTipAgent]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppCtx = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppCtx must be used within a AppContextProvider");
  }
  return context;
};
