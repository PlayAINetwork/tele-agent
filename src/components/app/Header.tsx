import { useState, useRef, useEffect } from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Menu, X } from "lucide-react";
import {  trimAddress } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { IMAGES } from "@/assets";
import StackPopup from "./StackPopup";
import CustomSolanaButton from "../WalletConnect/solConnectBtn";
import { useAuthState } from "@/context/auth.context";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import useLogout from "@/hooks/api/useLogout";
import getWalletSignMessage from "@/hooks/api/auth/getWalletSignMessage";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import connectWallet from "@/hooks/api/auth/connectWallet";
import { useWallet } from "@solana/wallet-adapter-react";

const MobileMenu = ({ isOpen, onClose, connected, address, logout, setVisible, navigate }: { isOpen: boolean, onClose: any, connected: any, address: string, logout: any, setVisible: any, navigate: any }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-64 bg-secondary border-l border-primary p-4">
        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose} className="p-2">
            <X className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex flex-col gap-4 mt-4">
          {connected ? (
            <>
              <StackPopup />
              <Button onClick={logout} className="w-full uppercase">
                {trimAddress(address, 4) + " "}
                {"[Disconnect]"}
              </Button>
            </>
          ) : (
            <Button onClick={() => {
              setVisible(true);
              onClose();
            }} className="w-full uppercase">
              Connect Wallet
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={() => {
              navigate("/rogueagent");
              onClose();
            }}
            className="w-full uppercase text-white"
          >
            {"> Leaderboard <"}
          </Button>

          <Button 
            variant="ghost"
            onClick={() => {
              
              navigate("/agent/def99ef5-2a4c-4f03-9614-b91ff3503217")
              onClose();
            }}
            className="w-full uppercase text-white"
          >
        {"> Watch_Rogue <"}
          </Button>
         

        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  

  // const [tokenData, setTokenData] = useState<any>(null);
  // const [totalStaked, setTotalStaked] = useState(0);
  // const { connection } = useConnection();
  const { connected, publicKey, disconnect, signMessage } = useWallet();
  const { auth, setAuth } = useAuthState();
  const { setVisible } = useWalletModal();
  const navigate = useNavigate();
  const logout = useLogout();
  const address = publicKey?.toString() ?? "";

  const isSigningRef = useRef(false);
  const { toast } = useToast();

  // const getTotalStakedBalance = async (
  //   connection: Connection
  // ): Promise<number> => {
  //   const programId = HOST_CONTRACT.PROGRAM_ID;
  //   try {
  //     // Create program instance
  //     const program = new Program(HOST_CONTRACT.IDL, new PublicKey(programId), {
  //       connection,
  //     } as Provider);

  //     // Get PlatformConfig PDA
  //     const [platformConfigPDA] = PublicKey.findProgramAddressSync(
  //       [Buffer.from("platform_config")],
  //       new PublicKey(programId)
  //     );

  //     // Get platform config data
  //     await program.account.platformConfig.fetch(platformConfigPDA);

  //     // Get platform mint token account PDA
  //     const [platformMintTokenAccountPDA] = PublicKey.findProgramAddressSync(
  //       [Buffer.from("platform_mint_token_account")],
  //       new PublicKey(programId)
  //     );

  //     // Get token balance
  //     const tokenBalance = await connection.getTokenAccountBalance(
  //       platformMintTokenAccountPDA
  //     );
  //     // Return the balance as a number
  //     return (
  //       Number(tokenBalance.value.amount) /
  //       Math.pow(10, tokenBalance.value.decimals)
  //     );
  //   } catch (error) {
  //     console.error("Error getting total staked balance:", error);
  //     throw error;
  //   }
  // };
  // const [isHovered, setIsHovered] = useState(false);
  // const TOKEN_ADDRESS = "27yzfJSNvYLBjgSNbMyXMMUWzx6T9q4B9TP8Jt8MZ9mL";
  // useEffect(() => {
  //   const fetchTokenData = async () => {
  //     try {
  //       const response = await fetch(
  //         `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`
  //       );
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch token data");
  //       }
  //       const data = await response.json();

  //       if (data.pairs && data.pairs.length > 0) {
  //         // Sort by volume and get the most liquid pair
  //         const mostLiquidPair = data.pairs.sort(
  //           (a: any, b: any) => parseFloat(b.priceUsd) - parseFloat(a.priceUsd)
  //         )[0];
  //         setTokenData(mostLiquidPair);
  //       } else {
  //         console.log("No trading pairs found");
  //       }
  //     } catch (err: any) {
  //       console.log(err.message);
  //     }
  //   };

  //   fetchTokenData();
  //   const interval = setInterval(fetchTokenData, 300000);
  //   return () => clearInterval(interval);
  // }, []);


  // useEffect(() => {
  //   const fetchTotalStaked = async () => {
  //     try {
  //       const balance = await getTotalStakedBalance(connection);
  //       setTotalStaked(balance);
  //     } catch (err) {
  //       console.log(
  //         err instanceof Error
  //           ? err.message
  //           : "Unknown error occurred while fetching platform stake count!"
  //       );
  //     }
  //   };

  //   fetchTotalStaked();
  // }, []);
  // console.log("total staked", totalStaked);




  useEffect(() => {
    const signWalletConnectMessage = async () => {
      try {
        if (!publicKey || !signMessage) {
          throw new Error('Wallet not connected!');
        }

        const message = await getWalletSignMessage();
        console.log("sdfd", message
        )

        if (!message) {
          throw new Error('Failed to get message to sign');
        }
        console.log("sdfd")

        // Convert message to Uint8Array
        const messageBytes = new TextEncoder().encode(message.message);
       

        // Sign the message
        const signature = await signMessage(messageBytes);
      


        if (signature && !isSigningRef.current) {
          const signatureHex = Buffer.from(signature).toString('hex');
          const signatureBase58 = bs58.encode(signature);

          console.log(signatureBase58, 'Signature successful:', signatureHex);
          isSigningRef.current = true;
          //login logic
          const user = await connectWallet(publicKey?.toString(), message?.nonce, signatureBase58);
          if (user.jwt) {
            let jwt = user.jwt;
            //note: enable when auth bug is fixed
            localStorage.setItem("token", jwt);
            setAuth({ token: jwt });
            toast({
              title: "Logged in Successfully! ",
            });
          }
        }

      } catch (error) {
        console.error('Signature failed:', error);
        // If user rejected the signature or any other error occurs, disconnect the wallet
        await handleDisconnect();
      }
    };
    console.log(publicKey, connected)
    if (connected && publicKey && !auth.token) {
      signWalletConnectMessage();
    }
  }, [connected, publicKey, signMessage, disconnect]);
  const handleDisconnect = async () => {
    try {
      logout()
    } catch (error) {
      console.error("Failed to disconnect:", error);
    } finally {
    }
  };

  return (
    <div className="flex justify-between w-full bg-secondary border-b-[1px] border-primary relative z-10">
      <div className="flex gap-3">
        {/* <img src={IMAGES.logo} alt="" className="w-[100px] lg:w-[200px]"/> */}
        <div
          className="w-full h-full bg-primary p-[2px]  uppercase"
          style={{
            clipPath: connected ? "polygon(0 0, 96.3% 2%, 100% 100%, 0% 100%)" : "polygon(0 0, 96.1% 2%, 100% 100%, 0% 100%)",


          }}
        >
          <div className="md:hidden flex cursor-pointer" onClick={() => navigate("/")}>
            <img src={IMAGES.logo} alt="" className="max-w-[11rem]" />
          </div>
          <div className="hidden md:flex h-full text-sm gap-[1px] ">
            <div className="cursor-pointer" onClick={() => navigate("/")}>
              <img src={IMAGES.logo} alt="" className="min-w-[12rem]" />
            </div>
            <div
              className="px-6 w-full h-full cursor-pointer bg-neutral-700 flex justify-center text-nowrap items-center overflow-hidden"
              style={{
                clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="text-white relative transition-transform duration-300 ease-in-out">
                <span
                  className={`block transition-all duration-300 ${
                    isHovered
                      ? "opacity-0 translate-y-full"
                      : "opacity-100 translate-y-0"
                  }`}
                >
                  {"> Learn more <"}
                </span>
                <span
                  className={`block absolute text-nowrap top-0 left-0  transition-all duration-300 ${
                    isHovered
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-full"
                  }`}
                >
                  {"> Coming soon <"}
                </span>
              </span>
            </div>
            

            <div
              className="px-4 text-nowrap w-full h-full cursor-pointer bg-neutral-700 flex justify-center items-center overflow-hidden"
              onClick={() => navigate("/rogueagent")}
            >
              <span className="text-white relative transition-transform duration-300 ease-in-out">
                {" > Leaderboard <"}
              </span>
            </div>
            <div
              onClick={() => navigate("/agent/def99ef5-2a4c-4f03-9614-b91ff3503217")}

              className="w-full  px-4 pr-8 font-700 cursor-pointer h-full bg-[#383838] text-nowrap flex justify-center items-center"
              style={{
                clipPath: "polygon(0 0, 85% 0%, 100% 100%, 0% 100%)",
              }}
            >
              {"> Watch_Rogue <"}
            </div>
            {/* <VideoGenertionPopup /> */}
          </div>
        </div>

        {/* <Button
          className="w-auto"
          onClick={
            () => ""
            //   copy("27yzfJSNvYLBjgSNbMyXMMUWzx6T9q4B9TP8Jt8MZ9mL")
          }
          variant={"ghost"}
        >
          Learn more
        </Button> */}
      </div>

      {/* Stats and Wallet Section */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex flex-col md:flex-row gap-2 text-sm md:text-base">
          {/* <div className="flex items-center gap-1">
            <span className="text-primary">STAKED:</span>
            <span>{`${formatBigNumber(totalStaked) ?? 0} $ROGUE`}</span>
          </div> */}
          {/* <div className="flex items-center gap-1">
            <span className="text-primary">$ROGUE:</span>
            <span>
              {tokenData?.priceUsd
                ? parseFloat(tokenData?.priceUsd).toFixed(6)
                : 0.0}
            </span>
          </div> */}
        </div>

        <div className="border-l border-primary h-full">
          {/* <div className="relative border-x-[1px] border-primary  h-full px-4 flex items-center">
            <Search />
            <Input
              className="pr-[5px] binaria border-none  uppercase bg-transparent w-[220px]"
              type="text"
              value={search}
              placeholder="search_agents"
              onChange={(e) => setSearch(e.target.value)}
            // disabled={disableAction}
            />
            {
              search !== "" ?
                <div className="z-100 absolute top-[67px] left-0  w-full max-h-[300px] bg-secondary overflow-scroll border border-primary p-2">
                  <div>
                    <AgentItem />
                    <AgentItem />
                    <AgentItem />
                    <AgentItem />
                    <AgentItem />
                    <AgentItem />


                  </div>

                </div>
                : null
            }

          </div> */}
          {connected ? (
            <Button onClick={logout} className="min-w-full text-sm py-1  h-full uppercase ">
              {trimAddress(address, 4) + " "}
              {"[Disconnect]"}
            </Button>
          ) : (
            <CustomSolanaButton

              connectText="Connect Wallet"
              disconnectText="Disconnect Wallet"
              buttonStyle="primary"
              size="medium"
            />
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
      
        <Button
          variant="ghost"
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2"
        >
          <Menu className="min-h-7 min-w-7" />
        </Button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        connected={connected}
        address={address}
        logout={logout}
        setVisible={setVisible}
        navigate={navigate}
      />
    </div>
  );
};

export default Header;