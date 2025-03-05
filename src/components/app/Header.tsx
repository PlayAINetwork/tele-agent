import { ICONS, IMAGES } from "@/assets";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

interface TokenData {
  priceUsd: string;
}

const TOKEN_ADDRESS = "27yzfJSNvYLBjgSNbMyXMMUWzx6T9q4B9TP8Jt8MZ9mL";
const REFRESH_INTERVAL = 30000; // 30 seconds

const Header = () => {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const navigate = useNavigate();
  const {pathname} = useLocation();
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
          // Sort by price and get the most liquid pair
          const mostLiquidPair = data.pairs.sort(
            (a: any, b: any) => parseFloat(b.priceUsd) - parseFloat(a.priceUsd)
          )[0];
          setTokenData(mostLiquidPair);
        } else {
          console.log("No trading pairs found");
        }
      } catch (err: any) {
        console.error("Error fetching token data:", err.message);
      }
    };

    fetchTokenData();
    const interval = setInterval(fetchTokenData, REFRESH_INTERVAL);
    
    return () => clearInterval(interval);
  }, []);

  const handleExternalLink = (url: string) => {
    window.open(url, "_blank");
  };

  // Menu items data for better maintainability
  const menuItems = [
    { text: "> features <", clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",link:"/features" },
    { text: "> experience Rogue <",link:"/rogue" },
    { text: "> Create w/ Rogue <",link:"/create-with-rogue" },
    { text: "> STAKE $ROGUE <",link:"/stake" },
    { text: "> Terminal <", clipPath: "polygon(0 0, 82% 0%, 100% 100%, 0% 100%)",link:"/terminal" }
  ];

  // Social media links for better maintainability
  const socialLinks = [
    { icon: ICONS.icon_coingecko, url: "https://www.coingecko.com/en/coins/agent-rogue" },
    { icon: ICONS.icon_cooki, url: "https://www.cookie.fun/en/agent/agent-rogue" },
    { icon: ICONS.icon_telegram, url: "https://t.me/AgentRogue_Official" },
    { icon: ICONS.icon_x, url: "https://x.com/0xRogueAgent" }
  ];

  return (
    <div className="flex justify-between w-full bg-secondary border-b-[1px] border-primary">
      {/* Logo and navigation section */}
      <div className="flex gap-3">
        <div
          className="w-full h-full bg-primary p-[2px] uppercase"
          style={{ clipPath: "polygon(0 0, 97.5% 2%, 100% 100%, 0% 100%)" }}
        >
          <div className="flex h-full">
            <div className="cursor-pointer" onClick={() => navigate("/")}>
              <img src={IMAGES.logo} alt="Logo" className="w-[130px] md:min-w-[200px]" />
            </div>
            
            {menuItems?.map((item, index) => (
              <Button
              variant={"ghost"}
              onClick={() => navigate(item.link)}
                key={index}
                className={`hidden md:flex w-full mr-[1px] px-4 font-700 cursor-pointer h-full  text-nowrap text-sm  justify-center items-center ${pathname == item?.link ? "bg-[#010101] text-primary" : "bg-[#383838] text-[#F1F6F2"} `}
                style={item.clipPath ? { clipPath: item.clipPath } : undefined}
              >
                {item.text}
              </Button>
            ))}
            
          </div>
        </div>
      </div>

      {/* Price and social media section */}
      <div className="flex items-center gap-4">
        <div className="flex  md:gap-2 text-[10px] md:text-xs md:pt-1">
          <p className="text-primary">$ROGUE:</p>
          <p>
            {tokenData?.priceUsd
              ? parseFloat(tokenData.priceUsd).toFixed(6)
              : "0.000000"}
          </p>
        </div>
        
        <div className="h-full flex uppercase">
          {socialLinks.map((link, index) => (
            <div
              key={index}
              onClick={() => handleExternalLink(link.url)}
              className="border-x-[1px] border-primary cursor-pointer h-full px-3 md:px-4 flex items-center"
            >
              <img src={link.icon} alt="" className="w-[15px] md:w-[27px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;