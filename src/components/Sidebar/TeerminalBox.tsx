import { Button } from "../ui/button";
import { Input } from "../ui/input";

const TeerminalBox = () => {

  return (
    <div className="flex flex-col  gap-2 bg-muted h-full p-4">
      <div className=" flex flex-col  gap-2">
        <Input className="h-[100px]" />
        <Button className="w-full">Add with 50k $ROGUE</Button>
        <p className="text-sm text-wrap font-thin leading-6">
          <span className="font-semibold">Disclaimer:</span> Topic injection
          isn’t instantaneous due to the high volume of requests, which may
          result in a queue.
        </p>
      </div>
    </div>
  );
};

export default TeerminalBox;
