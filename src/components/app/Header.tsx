import { ICONS } from "@/assets";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

const Header = () => {
  const [tokenData, setTokenData] = useState<any>(null);

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
            (a:any, b:any) => parseFloat(b.priceUsd) - parseFloat(a.priceUsd)
          )[0];
          setTokenData(mostLiquidPair);
        } else {
        console.log("No trading pairs found")

        }
      } catch (err: any) {
        console.log(err.message)
      } 
    };

    fetchTokenData();
    const interval = setInterval(fetchTokenData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between  p-4 w-full">
      <div className="flex gap-3">
        {/* <img src={IMAGES.logo} alt="" className="w-[100px] lg:w-[200px]"/> */}
        <p className="sixtyfour text-xl">
          {" "}
          THE AGENT <br />
    <span className="text-primary">      Experience</span>
        </p>

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
        <div className="flex  gap-2 text-md pt-1">
          <p className="text-primary">$ROGUE:</p>
          <p>
            {" "}
            {tokenData?.priceUsd
              ? parseFloat(tokenData?.priceUsd).toFixed(6)
              : 0.0}
          </p>
        </div>

        <Button
          onClick={() => open("https://www.coingecko.com/en/coins/agent-rogue", "_brace")}
          className=" uppercase rounded-[40px] p-0"
          variant={"ghost"}
        >
          <img src={ICONS.icon_PIXELS_coingecko} alt="" className="w-[50px]" />
        </Button>
        <Button
          onClick={() => open("https://dexscreener.com/solana/bgzm2era3ifpkcmb4w49of3cj9ruverxzhe2pzbbp8tv", "_brace")}
          className=" uppercase rounded-[40px] p-0"
          variant={"ghost"}
        >
          <img
            src={ICONS.icon_PIXELS_decscrenner}
            alt=""
            className="w-[50px]"
          />
        </Button>
        
        <Button
          onClick={() => open("https://x.com/0xRogueAgent", "_brace")}
          className=" uppercase rounded-[40px] p-0"
          variant={"ghost"}
        >
          <img src={ICONS.icon_PIXELS_X} alt="" className="w-[50px]" />
        </Button>
        <Button
          onClick={() => open("https://t.me/AgentRogue_Official", "_brace")}
          className=" uppercase rounded-[40px] p-0"
          variant={"ghost"}
        >
          <img src={ICONS.PIXELS_Telegram} alt="" className="w-[50px]" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
