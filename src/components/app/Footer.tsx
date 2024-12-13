import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

const Footer = () => {
  const { toast } = useToast();

    const copy = async (address: string) => {
        await navigator.clipboard.writeText(address);
        toast({
          title: "Address has been copied to the clipboard.",
        });
      };
  return (
    <div className="flex  justify-between w-full bg-card p-4 py-2">
        <div>
        <Button
        className="DIGITALIZE"
                onClick={() =>
                  copy("27yzfJSNvYLBjgSNbMyXMMUWzx6T9q4B9TP8Jt8MZ9mL")
                }
                variant={"ghost"}
              >
               <span className="text-primary">CA:</span>27yzfJSNvYLBjgSNbMyXMMUWzx6T9q4B9TP8Jt8MZ9mL
              </Button>
        </div>
      <div>
        <Button className="w-full py-1 px-6 h-auto uppercase rounded-[40px]">
          <div className="mt-1">BUY</div>
        </Button>
      </div>{" "}
    </div>
  );
};

export default Footer;
