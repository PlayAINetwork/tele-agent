import { useAppCtx } from "@/context/app.contex";
import { cn } from "@/lib/utils";
import { LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { hideSidebar, setHideSidebar } = useAppCtx();
  return (
    <aside
      className={cn(
        "h-full flex relative bg-[#00120A]   pt-4  overflow-hidden text-nowrap  text-lg  z-[100] flex-col  border-r-[.5px]",
        "transition-all duration-300 ease-in-out",
        hideSidebar ? "min-w-[80px]" : "min-w-[280px]",
        "-md:hidden"
      )}
    >
      <div className="flex h-full  flex-col justify-between">
        <div
          className={cn(
            "flex  items-center gap-2   w-full px-4 pb-2",
            hideSidebar ? "justify-center" : "justify-between "
          )}
        >
          {!hideSidebar && (
            <div
              className={cn(
                hideSidebar ? "hidden absolute left-0" : "flex gap-1"
              )}
            ></div>
          )}

          <div
            className="w-6 h-6  cursor-pointer bg-[#00120A]"
            onClick={() => setHideSidebar((prev) => !prev)}
          >
            {hideSidebar ? <LogIn absoluteStrokeWidth /> : <LogOut />}
          </div>
        </div>
        <div className="flex-1 px-4 overflow-scroll">
          <div className="flex flex-col gap-4 ">
            <div className="flex-1 ">
              {!hideSidebar && (
                <div className="flex uppercase underline">
                  <p>Top_agents</p>
                </div>
              )}

              <div
                className={`mt-4 flex flex-col gap-2 overflow-scroll ${hideSidebar ? "pt-6" : ""}`}
              >
                <AgentItem hideNav={hideSidebar} />
                <AgentItem hideNav={hideSidebar} />
                <AgentItem hideNav={hideSidebar} />
                <AgentItem hideNav={hideSidebar} />
              </div>
            </div>

            <div className="flex-1">
              <div
                className={`flex uppercase items-center gap-2 w-full underline ${hideSidebar ? "justify-center" : "text-center"}`}
              >
                {!hideSidebar ? (
                  <>
                    <p> new_agents</p>
                    <div className="w-full h-[1px] bg-[#fff]"></div>
                  </>
                ) : (
                  ">"
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2 ">
                <AgentItem hideNav={hideSidebar} />
                <AgentItem hideNav={hideSidebar} />
                <AgentItem hideNav={hideSidebar} />
                <AgentItem hideNav={hideSidebar} />
                <AgentItem hideNav={hideSidebar} />

              </div>
            </div>

            <div className="flex-1">
              <div
                className={`flex uppercase items-center gap-2 w-full underline ${hideSidebar ? "justify-center" : "text-center"}`}
              >
                {!hideSidebar ? (
                  <>
                    <p>watchlist</p>
                    <div className="w-full h-[1px] bg-[#fff]"></div>
                  </>
                ) : (
                  ">"
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2 overflow-scroll ">
                <AgentItem hideNav={hideSidebar} />
                <AgentItem hideNav={hideSidebar} />
                <AgentItem hideNav={hideSidebar} />
                <AgentItem hideNav={hideSidebar} />

              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;

export const AgentItem = ({
  hideNav,
}: {
  _onClick?: () => void;
  hideNav?: boolean;
}) => {
const navigate = useNavigate()

  return (
    <div
    onClick={()=>navigate("/agent/addid")}
    className="flex cursor-pointer rounded-sm gap-3 w-full p-2 hover:bg-white/10" >
      <img
        className="w-10  h-10 rounded-md"
        src="https://pbs.twimg.com/profile_images/1852454674768506880/5oDIMe7d_normal.jpg"
        alt=""
      />
      {hideNav ? null : (
        <div className="text-sm uppercase w-full ">
          <div className="flex font-medium gap-2  text-md">
            <p className="text-[16px]"> agents rogue</p>
            <div
              className="rounded-xs bg-primary text-[#000] gap-1 p-1 py-0  text-xs h-max flex justify-center items-center font-bold
            "
            >
              <div className="w-2 rounded-[50%] h-2 bg-[#000]"></div>
              <p className="pt-[2px]">Live</p>
            </div>
          </div>
          <div className="flex text-[#D4D4D4] w-full font-normal text-sm justify-between ">
            <div className="flex">
              <p>MC: $234M</p>
            </div>
            <div className="flex">
              <p>mindshare: 23%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
