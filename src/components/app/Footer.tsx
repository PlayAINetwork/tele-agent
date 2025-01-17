import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate()
  const {pathname} = useLocation()

 
  return (
    <div>
      {
        pathname == "/" ?
        <div className="flex">
        <div className=" w-[280px]  ">
          <Button variant={"outline"} className="w-full text-primary hover:text-primary"
          onClick={()=>navigate("/rogueagent")}
          >
            view leaderboard
          </Button>
        </div>
        {/* <div className=" flex-1   ">
          <Button className="w-full">claim agent channel</Button>
        </div> */}
      </div>

:null
      }
      

      <div className="flex  justify-between w-full border-t-[1px] border-primary bg-secondary p-4 py-2">
        <div>
          {/* <Button
            className="text-md"
            onClick={() => copy("27yzfJSNvYLBjgSNbMyXMMUWzx6T9q4B9TP8Jt8MZ9mL")}
            variant={"ghost"}
          >
            <span className="text-primary">CA:</span>
            27yzfJSNvYLBjgSNbMyXMMUWzx6T9q4B9TP8Jt8MZ9mL
          </Button> */}

          <div
          className="text-primary text-md"
          >
          Copyright © 2025 agentexperience • All Rights Reserved
          </div>
        </div>
        <div className="flex">
          <Button
            onClick={() =>
              open(
                "https://raydium.io/swap/?outputMint=27yzfJSNvYLBjgSNbMyXMMUWzx6T9q4B9TP8Jt8MZ9mL&inputMint=sol",
                "_brace"
              )
            }
            variant={"ghost"}
            className="w-full text-md  py-1 px-6 h-auto uppercase rounded-[40px]"
          >
            <div className="mt-1">BUY $ROGUE</div>
          </Button>
          
        </div>{" "}
      </div>
    </div>
  );
};

export default Footer;
