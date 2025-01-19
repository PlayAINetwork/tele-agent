import { IMAGES } from "@/assets";
import { useEffect, useRef, useState } from "react";
import StackPopup from "./StackPopup";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey } from "@solana/web3.js";
import { HOST_CONTRACT } from "@/contracts/host.contract.abi";
import { Program, Provider } from "@project-serum/anchor";
import { formatBigNumber, trimAddress } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import CustomSolanaButton from "../WalletConnect/solConnectBtn";
import getWalletSignMessage from "@/hooks/api/auth/getWalletSignMessage";
import { useAuthState } from "@/context/auth.context";
import connectWallet from "@/hooks/api/auth/connectWallet";
import { useToast } from "@/hooks/use-toast";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import useLogout from "@/hooks/api/useLogout";
import { Button } from "../ui/button";
// import { useNavigate } from "react-router-dom";

const Header = () => {
  const [tokenData, setTokenData] = useState<any>(null);
  const { connection } = useConnection();
  // const [search, setSearch] = useState("")
  const { connected, publicKey, disconnect, signMessage } = useWallet();
  const { auth, setAuth } = useAuthState();
  const { setVisible } = useWalletModal();
  const isSigningRef = useRef(false);
  const { toast } = useToast();
  const logout = useLogout();
  const address: any = publicKey?.toString();

  const [totalStaked, setTotalStaked] = useState<number>(0);
  const getTotalStakedBalance = async (
    connection: Connection
  ): Promise<number> => {
    const programId = HOST_CONTRACT.PROGRAM_ID;
    try {
      // Create program instance
      const program = new Program(HOST_CONTRACT.IDL, new PublicKey(programId), {
        connection,
      } as Provider);

      // Get PlatformConfig PDA
      const [platformConfigPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("platform_config")],
        new PublicKey(programId)
      );

      // Get platform config data
      await program.account.platformConfig.fetch(platformConfigPDA);

      // Get platform mint token account PDA
      const [platformMintTokenAccountPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("platform_mint_token_account")],
        new PublicKey(programId)
      );

      // Get token balance
      const tokenBalance = await connection.getTokenAccountBalance(
        platformMintTokenAccountPDA
      );
      // Return the balance as a number
      return (
        Number(tokenBalance.value.amount) /
        Math.pow(10, tokenBalance.value.decimals)
      );
    } catch (error) {
      console.error("Error getting total staked balance:", error);
      throw error;
    }
  };
  // const [isHovered, setIsHovered] = useState(false);
  const TOKEN_ADDRESS = "27yzfJSNvYLBjgSNbMyXMMUWzx6T9q4B9TP8Jt8MZ9mL";
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await fetch(
          `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch token data");
        }
        const data = await response.json();

        if (data.pairs && data.pairs.length > 0) {
          // Sort by volume and get the most liquid pair
          const mostLiquidPair = data.pairs.sort(
            (a: any, b: any) => parseFloat(b.priceUsd) - parseFloat(a.priceUsd)
          )[0];
          setTokenData(mostLiquidPair);
        } else {
          console.log("No trading pairs found");
        }
      } catch (err: any) {
        console.log(err.message);
      }
    };

    fetchTokenData();
    const interval = setInterval(fetchTokenData, 300000);
    return () => clearInterval(interval);
  }, []);
  const navigate = useNavigate();
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchTotalStaked = async () => {
      try {
        const balance = await getTotalStakedBalance(connection);
        setTotalStaked(balance);
      } catch (err) {
        console.log(
          err instanceof Error
            ? err.message
            : "Unknown error occurred while fetching platform stake count!"
        );
      }
    };

    fetchTotalStaked();
  }, []);
  console.log("total staked", totalStaked);




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
        console.log("sdfd", messageBytes)

        console.log("sdfd")

        // Sign the message
        const signature = await signMessage(messageBytes);
        console.log('Signature dsds:', signature);


        if (signature && !isSigningRef.current) {
          const signatureHex = Buffer.from(signature).toString('hex');
          const signatureBase58 = bs58.encode(signature);

          console.log(signatureBase58, 'Signature successful:', signatureHex);
          isSigningRef.current = true;
          //login logic
          const user = await connectWallet(publicKey?.toString(), message?.nonce, signatureBase58);
          console.log("user", user);
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
    <div className="flex justify-between  w-full bg-secondary border-b-[1px] border-primary relative z-10">
      <div className="flex gap-3">
        {/* <img src={IMAGES.logo} alt="" className="w-[100px] lg:w-[200px]"/> */}
        <div
          className="w-full h-full bg-primary p-[2px]  uppercase"
          style={{
            clipPath: "polygon(0 0, 96.3% 2%, 100% 100%, 0% 100%)",
          }}
        >
          <div className="flex h-full text-sm gap-[1px] ">
            <div className="cursor-pointer" onClick={() => navigate("/")}>
              <img src={IMAGES.logo} alt="" className="min-w-[12rem]" />
            </div>
            {/* <div
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
            </div> */}
            {connected ? (
              <StackPopup />
            ) : (
              <div
                onClick={() => setVisible(true)}
                className="px-4 w-full h-full cursor-pointer bg-neutral-700 flex justify-center items-center overflow-hidden"
                style={{
                  clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
                }}
              >
                <span className="text-white relative transition-transform duration-300 ease-in-out">
                  <span className="block transition-all duration-300 opacity-100 translate-y-0">
                    {"> stake now <"}
                  </span>
                </span>
              </div>
            )}

            <div
              className="px-4 text-nowrap w-full h-full cursor-pointer bg-neutral-700 flex justify-center items-center overflow-hidden"
              onClick={() => navigate("/rogueagent")}
            >
              <span className="text-white relative transition-transform duration-300 ease-in-out">
                {" > Leaderboard <"}
              </span>
            </div>
            <div
              onClick={() => navigate("/rogue")}

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
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="flex  gap-1 text-md pt-1">
            <p className="text-primary">STAKED:</p>
            <p>
              {`${formatBigNumber(totalStaked) ?? 0}`}
              <span className="text-xs font-medium">{` $ROGUE`}</span>
            </p>
          </div>
          <div className="flex  gap-1 text-md pt-1">
            <p className="text-primary">$ROGUE:</p>
            <p>
              {" "}
              {tokenData?.priceUsd
                ? parseFloat(tokenData?.priceUsd).toFixed(6)
                : 0.0}
            </p>
          </div>
        </div>
        <div className="h-full flex uppercase">

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

          {connected ?
            <Button
              onClick={logout}
              className="w-full text-md py-1 px-6 h-auto uppercase "
            >
              <div className="mt-1">
                {" "}
                {trimAddress(address, 4) + " "}
                {"[Disconnect]"}
              </div>
            </Button>
            :

            (
              <div
                className="border-x-[1px] border-primary cursor-pointer  flex items-center"

              >
                <CustomSolanaButton

                  connectText="Connect Wallet"
                  disconnectText="Disconnect Wallet"
                  buttonStyle="primary"
                  size="medium"
                />
              </div>
            )}

          {/* <div
            onClick={() =>
              open("https://www.coingecko.com/en/coins/agent-rogue", "_brace")
            }
            className="border-x-[1px] border-primary cursor-pointer h-full px-6 flex items-center"
          >
            <img src={ICONS.icon_coingecko} alt="" className="w-[37px]" />
          </div>
          <div
            onClick={() =>
              open("https://www.cookie.fun/en/agent/agent-rogue", "_brace")
            }
            className="border-x-[1px] border-primary cursor-pointer h-full px-6 flex items-center"
          >
            <img src={ICONS.icon_cooki} alt="" className="w-[41px]" />
          </div>
          <div
            onClick={() => open("https://t.me/AgentRogue_Official", "_brace")}
            className="border-x-[1px] border-primary cursor-pointer h-full px-10 flex items-center"
          >
            telegram
          </div>
          <div
            onClick={() => open("https://x.com/0xRogueAgent", "_brace")}
            className="border-x-[1px] border-primary cursor-pointer h-full px-10 flex items-center"
          >
            Twitter
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Header;
