import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppContextProvider } from "./context/app.contex.tsx";
import { Toaster } from "./components/ui/toaster.tsx";
import ConvexServerProvider from "./providers/ConvexProvider.tsx";
import { SolanaWalletProvider } from "./providers/SolanaWalletProvider.tsx";
import { Buffer } from 'buffer';
window.Buffer = Buffer;
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexServerProvider>
        <SolanaWalletProvider>
          <AppContextProvider>
            <App />
            <Toaster />
          </AppContextProvider>
        </SolanaWalletProvider>
    </ConvexServerProvider>
  </StrictMode>
);
