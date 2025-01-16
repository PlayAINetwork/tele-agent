import { ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";

// import { WalletConnectWalletAdapter } from "@walletconnect/solana-adapter";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletError } from "@solana/wallet-adapter-base";

export const SolanaWalletProvider = ({ children }: { children: ReactNode }) => {
  const endpoint =
    "https://aged-clean-dream.solana-mainnet.quiknode.pro/51a78aa7597a179d9adb3aa72df855eff57fc23a";

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      // new WalletConnectWalletAdapter({
      //   network: WalletAdapterNetwork.Mainnet,
      //   options: {
      //     projectId: "YOUR_PROJECT_ID",
      //   },
      // }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={true}
        onError={(error: WalletError) => console.error(error)}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
