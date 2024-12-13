import { useAppCtx } from "@/context/app.contex";
import { Button } from "../ui/button";

const Tabs = () => {
  // 'add character'
  const types = ["global", "inject", "terminal", "create"];
  const { setSidebarMenu, sidebarMenu } = useAppCtx();

  return (
    <div className="gap-2 px-4 flex overflow-auto horizontalBar">
      {types.map((tab) => (
        <Button
          className="uppercase min-w-[100px] rounded-[40px]"
          variant={sidebarMenu === tab ? "active" : "outline"}
          onClick={() => setSidebarMenu(tab)}
        >
          <div className="mt-1">{tab}</div>{" "}
        </Button>
      ))}
    </div>
  );
};

export default Tabs;
