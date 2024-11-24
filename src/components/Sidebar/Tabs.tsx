import { useAppCtx } from "@/context/app.contex";
import { Button } from "../ui/button";

const Tabs = () => {
  // 'add character'
  const types = ["global", "inject"];
  const { setSidebarMenu ,sidebarMenu} = useAppCtx();

  return (
    <div className="gap-2 flex">
      {types.map((tab) => (
        <Button className="uppercase min-w-[100px] rounded-none" variant={sidebarMenu === tab ? "active":"outline" } onClick={()=>setSidebarMenu(tab)}>
          {tab}
        </Button>
      ))}
    </div>
  );
};

export default Tabs;
