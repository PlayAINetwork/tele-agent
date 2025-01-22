
import GlobelBox from "./GlobelBox";



import Collapsible from "../app/Collapsible";

import TerminalDemo from "./TerminalLogs";
import TeerminalBox from "./TeerminalBox";
import CharacterBox from "./CharacterBox";
import StackBox from "./StackBox";
import { useParams } from "react-router-dom";
import { formatBigNumber } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { HOST_CONTRACT } from "@/contracts/host.contract.abi";
import { Program, Provider } from "@project-serum/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import GenerateVedio from "./GenerateVedio";



const Sidebar = () => {
  const { id } = useParams();
  const [totalStaked, setTotalStaked] = useState(0);
  const { connection } = useConnection();

  // const config = genConfig(address);

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

  return (
    <aside
      className="relative h-full max-w-[100%] md:max-w-[420px] min-w-[100%] md:min-w-[420px] "

    >


      <div className=" relative z-[10] binaria flex flex-col gap-4 py-2 md:py-12 px-4 md:px-0  md:pr-4 ">
        <div
          className="  pt-5 flex text-lg cursor-pointer items-center gap-0  uppercase"
        >
          <p>Agent services</p>
        </div>
        <Collapsible titel={"GLObal chat"} subtext={"chat with the community."} showD={true}>
          <GlobelBox />

          {/* <div className="p-4">
            <ChatComponent agentId={id} />
          </div> */}
        </Collapsible>



        {
          id === "def99ef5-2a4c-4f03-9614-b91ff3503217"

            ?
            <Collapsible titel={"terminal"} subtext={"brain of the agent to verify rag, memory, and automated tasks."}>
              <TerminalDemo />
            </Collapsible>

            : null
        }

        {
          id === "def99ef5-2a4c-4f03-9614-b91ff3503217"

            ?
            <Collapsible titel={"topic injection"} subtext={"add custom topics or links for agents."}>
              <TeerminalBox />
            </Collapsible>

            : null
        }

{
          id === "def99ef5-2a4c-4f03-9614-b91ff3503217"

            ?
            <Collapsible titel={"video creation"} subtext={"create custom videos with the agent by using simple prompts."}>
              <GenerateVedio />
            </Collapsible>

            : null
        }

        {
          id === "def99ef5-2a4c-4f03-9614-b91ff3503217"

            ?
            <Collapsible titel={"character injection"} subtext={"add custom topics or links for agents."}>
              <CharacterBox />
            </Collapsible>

            : null
        }
        {
          id === "def99ef5-2a4c-4f03-9614-b91ff3503217"

            ?
            <Collapsible titel={"Staking $ROGUE"} subtext={"Stake $Rogue to earn rewards."} rightSide={<div className="">
              <div className="flex items-center gap-1">
                <span>{`${formatBigNumber(totalStaked) ?? 0}`}</span>
                <span >STAKED</span>
              </div>
            </div>}>
              <StackBox />
            </Collapsible>
            : null
        }


        {/* <div className="flex flex-col gap-0 h-full">
            <Tabs />
            <div className="grow  h-4   ">
              {sidebarMenu === "global" ? (
                <GlobelBox />
              ) : sidebarMenu === "inject" ? (
                <TeerminalBox />
              ) : sidebarMenu === "terminal" ? (
                <TerminalLogs />
              ) : sidebarMenu === "create" ? (
                <GenerateVedio />
              ) : (
                <CharacterBox />
              )}
            </div>
            
          </div> */}

      </div>
    </aside>
  );
};

export default Sidebar;
