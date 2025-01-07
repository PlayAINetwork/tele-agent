import { useAppCtx } from "@/context/app.contex";
import { cn } from "@/lib/utils";
import { Diamond, PanelRight, SquarePen } from "lucide-react";
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";

const Navbar = () => {
  const { hideSidebar, setHideSidebar } = useAppCtx();
  return (
    <aside
      className={cn(
        "h-full flex relative bg-[#00120A]   pt-4  overflow-hidden text-nowrap  text-lg  z-[100] flex-col  border-r-[.5px]",
        "transition-all duration-300 ease-in-out",
        hideSidebar ? "w-[80px]" : "w-[280px]",
        "-md:hidden"
      )}
    >
      <div className="flex h-full  flex-col justify-between">
        <div
          className={cn(
            "flex  items-center gap-2 absolute  w-full px-4",
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

          <PanelRight
            className="w-6 h-6 cursor-pointer"
            onClick={() => setHideSidebar((prev) => !prev)}
          />
        </div>
        <div className="flex-1 px-4">
          <div className="flex flex-col gap-4 ">
            <div className="flex-1 ">
              {!hideSidebar && (
                <div className="flex uppercase underline">
                  <p>Top_agents</p>
                </div>
              )}

              <div className={`mt-4 flex flex-col gap-3 overflow-scroll ${hideSidebar ? "pt-6":""}`}>
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

              <div className="mt-4 flex flex-col gap-3 ">
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
              
              <div className="mt-4 flex flex-col gap-3 ">
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
  children,
  _onClick,
  hideNav,
}: {
  children?: ReactNode;
  _onClick?: () => void;
  hideNav?: boolean;
}) => {
  return (
    <div className="flex gap-3 w-full">
      <img
        className="w-10  h-10 rounded-md"
        src="https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
        alt=""
      />
      {hideNav ? null : (
        <div className="text-sm uppercase  ">
          <div className="flex font-medium  text-md">
            <p> agents rogue</p>
            <p>Live</p>
          </div>
          <div className="flex text-muted-foreground font-normal text-sm justify-between ">
            <div className="flex">
              <p>MC: $234M</p>
            </div>
            <div className="flex">
              <p>MC: $234M</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
