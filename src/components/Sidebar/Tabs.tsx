import { useAppCtx } from "@/context/app.contex";
import { Button } from "../ui/button";
import DYNAMICICONS from "@/assets/DynamicIcon";

const Tabs = () => {
  // 'add character'

  const types = [
    {
      show_text :"gbl_chat",
      title: "global",
      Icon: <DYNAMICICONS.Globle color="#F1F6F2" />,
      activeIcone: <DYNAMICICONS.Globle color="#010101" />,
    },
    {
      show_text :"topic_injc",

      title: "inject",
      Icon: <DYNAMICICONS.message color="#F1F6F2" />,

      activeIcone: <DYNAMICICONS.message color="#010101" />,
    },
   
    {
      show_text :"chr_injc",

      title: "add character",
      Icon: <DYNAMICICONS.injectTopic color="#F1F6F2" />,

      activeIcone: <DYNAMICICONS.injectTopic color="#010101" />,
    },
    {
      show_text :"terminal",

      title: "terminal",
      Icon: <DYNAMICICONS.terminal color="#F1F6F2" />,

      activeIcone: <DYNAMICICONS.terminal color="#010101" />,
    },
    // {
    //   show_text :"",

    //   title: "create",
    //   Icon: <DYNAMICICONS.Globle color="#F1F6F2" />,

    //   activeIcone: <DYNAMICICONS.Globle color="#010101" />,
    // },
  ];

  const { setSidebarMenu, sidebarMenu } = useAppCtx();

  return (
    <div className="gap-0  grid grid-cols-4 overflow-auto horizontalBar">
      {types.map((tab) => (
        <Button
          className="uppercase   "
          variant={sidebarMenu === tab?.title ? "active" : "outline"}
          onClick={() => setSidebarMenu(tab?.title)}
        >
          <div
            className={`flex gap-2 mt-1 ${sidebarMenu === tab?.title ? "text-[#010101] " : "text-[#F1F6F2]"}`}
          >
            {sidebarMenu === tab?.title ? tab.activeIcone : tab.Icon}
            {tab.show_text}
          </div>{" "}
        </Button>
      ))}
    </div>
  );
};

export default Tabs;
