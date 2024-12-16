import { ICONS, IMAGES } from "@/assets";
import { useEffect, useState } from "react";

const Header = () => {
  const [tokenData, setTokenData] = useState<any>(null);
  const [isHovered, setIsHovered] = useState(false);
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
    const interval = setInterval(fetchTokenData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between  w-full bg-secondary border-b-[1px] border-primary">
      <div className="flex gap-3">
        {/* <img src={IMAGES.logo} alt="" className="w-[100px] lg:w-[200px]"/> */}
        <div
          className="w-full h-full bg-primary p-[2px] uppercase"
          style={{
            clipPath: "polygon(0 0, 94.5% 2%, 100% 100%, 0% 100%)",
          }}
        >
          <div className="flex h-full ">
            <div>
              <img src={IMAGES.logo} alt="" className="min-w-[220px]" />
            </div>
            <div
      className="px-12 w-full h-full cursor-pointer bg-neutral-700 flex justify-center items-center overflow-hidden"
      style={{
        clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-white relative transition-transform duration-300 ease-in-out">
        <span 
          className={`block transition-all duration-300 ${
            isHovered ? 'opacity-0 translate-y-full' : 'opacity-100 translate-y-0'
          }`}
        >
          {"> Learn more <"}
        </span>
        <span 
          className={`block absolute text-nowrap top-0 left-0  transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
          }`}
        >
              {"> Coming soon <"}
       
        </span>
      </span>
    </div>
            <div
              className="w-full  px-12 font-700 cursor-pointer h-full bg-[#383838] text-nowrap flex justify-center items-center"
              style={{
                clipPath: "polygon(0 0, 85% 0%, 100% 100%, 0% 100%)",
              }}
            >
              {"> Create w/ Rogue <"}
            </div>
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
        <div className="flex  gap-2 text-md pt-1">
          <p className="text-primary">$ROGUE:</p>
          <p>
            {" "}
            {tokenData?.priceUsd
              ? parseFloat(tokenData?.priceUsd).toFixed(6)
              : 0.0}
          </p>
        </div>
        <div className="h-full flex uppercase">
          <div 
             onClick={() =>
              open("https://www.coingecko.com/en/coins/agent-rogue", "_brace")
            }
          className="border-x-[1px] border-primary cursor-pointer h-full px-6 flex items-center">
            <img
              src={ICONS.icon_coingecko}
              alt=""
              className="w-[37px]"
            />
          </div>
          <div 
            onClick={() =>
              open("https://www.cookie.fun/en/agent/agent-rogue", "_brace")
            }
          className="border-x-[1px] border-primary cursor-pointer h-full px-6 flex items-center">
            <img
              src={ICONS.icon_cooki}
              alt=""
              className="w-[41px]"
            />
          </div>
          <div
            onClick={() =>
              open("https://t.me/AgentRogue_Official", "_brace")
            }
          className="border-x-[1px] border-primary cursor-pointer h-full px-10 flex items-center">
            telegram
          </div>
          <div
            onClick={() =>
              open("https://x.com/0xRogueAgent", "_brace")
            }
          className="border-x-[1px] border-primary cursor-pointer h-full px-10 flex items-center">
            Twitter
          </div>
        </div>

        {/* <Button
          onClick={() =>
            open("https://www.coingecko.com/en/coins/agent-rogue", "_brace")
          }
          className=" uppercase rounded-[40px] p-0"
          variant={"ghost"}
        >
        </Button>
        <Button
          onClick={() =>
            open(
              "https://dexscreener.com/solana/bgzm2era3ifpkcmb4w49of3cj9ruverxzhe2pzbbp8tv",
              "_brace"
            )
          }
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
        </Button> */}
      </div>
    </div>
  );
};

export default Header;
