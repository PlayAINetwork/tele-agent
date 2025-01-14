import {  ICONS, IMAGES } from "@/assets";
import { useEffect, useState } from "react";
import VideoGenertionPopup from "../Sidebar/VideoGenertionPopup";
import StackPopup from "./StackPopup";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Connection, PublicKey } from "@solana/web3.js";
import { HOST_CONTRACT } from "@/contracts/host.contract.abi";
import { Program, Provider } from "@project-serum/anchor";
import { formatBigNumber } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

const Header = () => {
  const [tokenData, setTokenData] = useState<any>(null);
  const { connected } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
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
          // const mostLiquidPair = data.pairs.sort(
          //   (a: any, b: any) => parseFloat(b.priceUsd) - parseFloat(a.priceUsd)
          // )[0];
          // setTokenData(mostLiquidPair);
        } else {
          console.log("No trading pairs found");
        }
      } catch (err: any) {
        console.log(err.message);
      }
    };

    fetchTokenData();
    const interval = setInterval(fetchTokenData, 30000);
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
  return (
    <div className="flex justify-between  w-full bg-secondary border-b-[1px] border-primary relative z-10">
      <div className="flex gap-3">
        {/* <img src={IMAGES.logo} alt="" className="w-[100px] lg:w-[200px]"/> */}
        <div
          className="w-full h-full bg-primary p-[2px]  uppercase"
          style={{
            clipPath: "polygon(0 0, 95.5% 2%, 100% 100%, 0% 100%)",
          }}
        >
          <div className="flex h-full text-sm gap-[1px] ">
            <div className="cursor-pointer" onClick={() => navigate("/")}>
              <img src={IMAGES.logo} alt="" className="min-w-[220px]" />
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
                className="px-12 w-full h-full cursor-pointer bg-neutral-700 flex justify-center items-center overflow-hidden"
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

            {/* <div
              className="px-6 text-nowrap w-full h-full cursor-pointer bg-neutral-700 flex justify-center items-center overflow-hidden"
              onClick={() => navigate("/rogueagent")}
            >
              <span className="text-white relative transition-transform duration-300 ease-in-out">
                {" > Leaderboard <"}
              </span>
            </div> */}

            <VideoGenertionPopup />
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
          <div
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
          </div>
        </div> 
      </div>
    </div>
  );
};

export default Header;
