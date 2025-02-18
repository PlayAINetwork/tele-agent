import Header from "@/components/app/Header";
import Footer from "@/components/app/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { IMAGES } from "@/assets";
import { useAppCtx } from "@/context/app.contex";
import { useEffect, useState } from "react";

function AppLayout() {
  const {pathname} = useLocation();
const {isMobile} = useAppCtx()

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
    <main className={`h-[100vh]  realtive  flex flex-col overflow-hidden`}>
   {isMobile ? (
        <div className="h-full w-full  justify-center items-center flex flex-col">
          <div className="flex justify-between  w-full bg-secondary border-b-[1px] border-primary">
            <div className="w-full h-full bg-primary p-[2px] uppercase">
              <div className="flex h-full justify-between">
                <div>
                  <img src={IMAGES.logo} alt="" className="w-[180px]" />
                </div>

                <div
                  className="pl-14 px-10 text-center  min-h-full cursor-pointer bg-neutral-700 flex text-sm justify-center items-center overflow-hidden"
                  style={{
                    clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
                  }}
                >
                  <span className="text-white relative transition-transform duration-300 ease-in-out">
                    $ROGUE:
                    <span
                      className={`block transition-all duration-300 ${"opacity-100 translate-y-0"}`}
                    >
                      {tokenData?.priceUsd
                        ? parseFloat(tokenData?.priceUsd).toFixed(6)
                        : 0.0}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full px-4 gap-16 flex h-full flex-col justify-center itmes-center">
            <div className="mx-auto">
              <img src={IMAGES.mobile} alt="" className="mx-auto mb-6" />
              <p className="text-2xl uppercase py-[3px] text-center ">
                Best experienced only
                <br />
                on desktop
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
            {/* <div className="border-[1px] border-primary  h-[50px]">

{connected ? (
  <StackPopup />
) : (
  <div
    onClick={() => setVisible(true)}
    className="px-12 w-full h-full cursor-pointer bg-neutral-700 flex justify-center items-center overflow-hidden"
   
  >
    <span className="text-white relative transition-transform duration-300 ease-in-out">
      <span className="block transition-all uppercase duration-300 opacity-100 translate-y-0">
        {"> stake now <"}
      </span>
    </span>
  </div>
)}
</div> */}
              <div className="flex uppercase items-center bg-[#383838] gap-4 border-[1px] border-primary">
                <div
                  onClick={() =>
                    open("https://t.me/AgentRogue_Official", "_brace")
                  }
                  className="flex-1 cursor-pointer h-full px-10 py-4 flex items-center"
                >
                  telegram
                </div>
                <div
                  onClick={() => open("https://x.com/0xRogueAgent", "_brace")}
                  className="flex-1 border-x-[1px] border-primary py-4 cursor-pointer h-full px-10 flex items-center"
                >
                  Twitter
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
      <div className="flex flex-col flex-1 h-full">
        <Header />

        <div className={`flex-1 flex flex-col relative z-[1] overflow-y-hidden w-[100%] ${pathname !== "/"  ?"max-w-[1500px] mx-auto" :""} py-6 `}>
          {
            pathname !== "/" && (
              <div className="absolute w-full h-full opacity-50">
              <img src={IMAGES.bg} alt="" className="h-full"/>
            </div>
            )
          }
         
          <div className={`relative z-[1]  h-full w-full ${pathname === "/" ? "p-0" : "md:p-10 p-4"}`}>
          <Outlet />

          </div>
        </div>

        <Footer />
      </div>
      )}
    </main>
  );
}

export default AppLayout;
