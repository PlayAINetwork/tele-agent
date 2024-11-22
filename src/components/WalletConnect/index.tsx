// import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
// import { Button } from "@/components/ui/button";
// import { Wallet } from "lucide-react";
// // import { getChainId } from "wagmi/actions";
// import { trimAddress } from "@/lib/utils";
// import { useState } from "react";
// // import { toast } from "sonner";
// const ConnectWallet = () => {
//   const { open } = useAppKit();
//   const [loginInitiated] = useState(false);
//   //   const { disconnect } = useDisconnect();
//   //   const isSigningRef = useRef(false);
//   //   const { switchChain } = useSwitchChain();
//   const { address } = useAppKitAccount();
//   //   const chainId = getChainId(evm_config);
//   //   const signWalletConnectMessage = useCallback(async (address: any) => {
//   //     if (!address || isSigningRef.current) return;
//   //     //swithch chain
//   //     if (chainId !== 84532) {
//   //       switchChain({ chainId: 84532 });
//   //     }
//   //     setLoginInitiated(true);
//   //     try {

//   //     } catch (err) {
//   //       disconnect();
//   //       console.log("error linking wallet!", err);
//   //     } finally {
//   //       setLoginInitiated(false);
//   //       isSigningRef.current = false;
//   //     }
//   //   }, []);

//   return (
//     <Button
//       onClick={() => {
//         open();
//       }}
//       className="justify-between rounded-none items-center w-full py-6 "
//     >
//       {loginInitiated
//         ? "Connecting . . ."
//         : address
//         ? trimAddress(address)
//         : "Connect Wallet"}
//       <Wallet className="w-5 h-8 e" />
//     </Button>
//   );
// };

// export default ConnectWallet;
