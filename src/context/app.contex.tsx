import React, { createContext, useContext, useState, useMemo, useEffect } from "react";

interface AppContextType {
  hideSidebar: boolean;
  sidebarMenu: string;
  disableAction:boolean;
  videoGeneraing:boolean;
  isLive:boolean;
  isMobile:boolean;


  setIsLive: React.Dispatch<React.SetStateAction<boolean>>;

  setHideSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  setSidebarMenu: React.Dispatch<React.SetStateAction<string>>;
  setDisableAction: React.Dispatch<React.SetStateAction<boolean>>;
  setVideoGeneraing: React.Dispatch<React.SetStateAction<boolean>>;

}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [hideSidebar, setHideSidebar] = useState(false);
  const [sidebarMenu, setSidebarMenu] = useState("global");
  const [disableAction, setDisableAction] = useState(false);
  const [videoGeneraing, setVideoGeneraing] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if screen width is mobile
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check initially
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const value = useMemo(
    () => ({isMobile, videoGeneraing,hideSidebar,sidebarMenu,disableAction,isLive, setIsLive, setHideSidebar,setSidebarMenu,setDisableAction ,setVideoGeneraing}),
    [isMobile,videoGeneraing,hideSidebar,sidebarMenu,disableAction, isLive, setIsLive,setHideSidebar,setSidebarMenu,setDisableAction,setVideoGeneraing]
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
