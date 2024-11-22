import  { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "../ui/button";

const CustomSolanaButton = ({
  connectText = "Connect Wallet",
  disconnectText = "Disconnect",
  buttonStyle = "primary",
  size = "medium",
}) => {
  const { connected, publicKey, disconnect } = useWallet();
  const [loading, setLoading] = useState(false);

  // Style configurations
  const sizes: any = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };

  const styles: any = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    outline: "border-2 border-purple-600 text-purple-600 hover:bg-purple-50",
  };

  const baseStyle = `
    rounded-lg font-semibold transition-all duration-200
    flex items-center justify-center gap-2
    ${sizes[size]}
    ${styles[buttonStyle]}
  `;

  const shortenAddress = (address:any) => {
    setLoading(false)
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleClick = async () => {
    if (connected) {
      try {
        await disconnect();
      } catch (error) {
        console.error("Failed to disconnect:", error);
      }
    }
  };

  const buttonText = connected
    ? `${shortenAddress(publicKey?.toString())} (${disconnectText})`
    : connectText;

  return (
   <Button className="w-full px-0">

      <WalletMultiButton
        className={`${baseStyle} bg-transparent ${loading ? "opacity-75 cursor-not-allowed w-full" : "min-w-full "}`}
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : null}
        {buttonText}
      </WalletMultiButton>
      </Button>

  );
};

export default CustomSolanaButton;
