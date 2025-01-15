
import { useAuthState } from "@/context/auth.context";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../use-toast";

const useLogout = () => {
    const {  disconnect } = useWallet();
    const { toast } = useToast();
  
  const { setAuth } = useAuthState();
  const nav = useNavigate();
  const logout = () => {
    setAuth({ token: null });
    localStorage.clear();
    toast({
      title: "Logged out ",
    });
    disconnect();
    nav("/");
  };
  return logout;
};

export default useLogout;
