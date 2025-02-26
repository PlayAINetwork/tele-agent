import DYNAMICICONS from "@/assets/DynamicIcon";
import TerminalLogs from "@/components/Sidebar/TerminalLogs";

const Terminal = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full ">
      <div className=" relative border-[1px] border-primary  place-content-center place-items-center h-[80vh] md:h-[70vh] md:w-[75%] flex flex-col">
        <div className="absolute w-4 h-4 bg-primary left-[-10px] top-[-10px]"></div>
        <div className="absolute w-4 h-4 bg-primary right-[-10px] top-[-10px]"></div>
        <div className="absolute w-4 h-4 bg-primary left-[-10px] bottom-[-10px]"></div>
        <div className="absolute w-4 h-4 bg-primary right-[-10px] bottom-[-10px]"></div>

        <div className="border-b-[1px] bg-primary items-center gap-2 border-primary py-2 px-2 flex uppercase text-black justify-center w-full">
          <DYNAMICICONS.terminal color="#000" />
          <p className="text-lg font-semibold leading-lg">terminal</p>
        </div>
        <div className="border-b-[1px] bg-[#1A1A1A] border-primary py-2 px-2 flex uppercase justify-start w-full">
          <p className="text-[14px] text-[#B6B6B6]">
            terminal_is_the_brain_of_the_agent.
          </p>
        </div>
        <div className="h-full w-full overflow-hidden ">
          <TerminalLogs />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
