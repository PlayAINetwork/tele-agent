import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppContextProvider } from "./context/app.contex.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import ConvexServerProvider from "./providers/ConvexProvider.tsx";
import { SolanaWalletProvider } from "./providers/SolanaWalletProvider.tsx";
import { AuthContextProvider } from "./context/auth.context.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexServerProvider>
    <QueryClientProvider client={queryClient}>
        <SolanaWalletProvider>
          <AppContextProvider>
          <AuthContextProvider>
            <App />
            </AuthContextProvider>
            <Toaster />
          </AppContextProvider>
        </SolanaWalletProvider>
        </QueryClientProvider>
    </ConvexServerProvider>
  </StrictMode>
);
