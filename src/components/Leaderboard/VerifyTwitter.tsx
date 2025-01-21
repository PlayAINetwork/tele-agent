import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTrigger } from '../ui/dialog';
import { ChevronRight, X } from 'lucide-react';
import { Button } from '../ui/button';
import { IMAGES } from '@/assets';
import { Agent } from '@/types';
import getTwitterAuthUrl from '@/hooks/api/auth/getTwitterAuthUrl';
import { useEffect, useMemo, useState } from 'react';
import { getUrlParameter } from '@/lib/utils';
import connectTwitter from '@/hooks/api/auth/connectTwitter';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

function VerifyTwitter({ data }: { data: Agent }) {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();
    const location = useLocation();

    // const from = location.state?.from?.pathname || "/";

    const handleRedirectToX = async () => {
        const TwitterAuthUrl: any = await getTwitterAuthUrl();

        window.location.href = TwitterAuthUrl?.url
    }

    const code = useMemo(() => getUrlParameter("code"), [location]);
    const state = useMemo(() => getUrlParameter("state"), [location]);
    useEffect(() => {
        (async () => {
            try {
                if (code && state && data?.id) {
                    console.log("xConnected")

                    const xConnected = await connectTwitter(code, state, data?.id);
                    console.log(xConnected)
                    navigate('/rogueagent', { replace: true });

                    if (xConnected) {
                        console.log(xConnected)
                        toast({
                            title: "Verified Successfully! ",
                        });
                    }

                }

            } catch (error: any) {
                console.log(error)
                toast({
                    title: "Verification Faild! ",
                    description: error?.message,
                });
                navigate('/rogueagent', { replace: true });



            }

        })()
    }, [code, state]);



    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="  h-full cursor-pointer flex justify-center items-center overflow-hidden">
                    <span className="text-white relative transition-transform duration-300 ease-in-out">
                        <span className="block text-primary transition-all duration-300 opacity-100 translate-y-0">
                            Verify now
                        </span>
                    </span>
                </div>
            </DialogTrigger>
            {isOpen && (
                <DialogContent
                    className="flex flex-col sm:max-w-md md:max-w-[500px] gap-0 border-2 border-primary binaria bg-[#181818] p-0 pt-0 overflow-auto"
                    onPointerDownOutside={(e) => e.preventDefault()}
                >
                    <div className="flex justify-between">
                        <DialogDescription className="px-4 w-full uppercase text-md  py-2 cursor-pointer bg-[#181818] text-[#fff]">
                            {">> verify agents"}
                        </DialogDescription>

                        <DialogClose className="min-w-[40px] flex justify-center items-center bg-primary z-10">
                            <X className="text-black" />
                        </DialogClose>
                    </div>

                    <div className="flex-1 h-full overflow-auto w-full">
                        <div className="flex flex-col h-full py-6 px-6 w-full border-primary border-[1px] justify-center items-center gap-4 bg-[#131314]">
                            <div className="flex gap-3 w-full flex-wrap">
                                <div className="flex w-full flex-col gap-2 text-[#F1F6F2]">
                                    <div className="flex w-full justify-between uppercase text-sm">
                                        connect the agent twitter account to verify, claim live channel, grab rewards, and upgrade agent skills.
                                    </div>
                                </div>
                                <div className="flex justify-between w-full gap-4 mt-4">
                                    <div className="flex gap-2 items-center">
                                        <img
                                            className="w-10 h-10 rounded-md"
                                            src={data?.avatar}
                                            alt=""
                                        />
                                        <div>
                                            <div className="flex font-medium gap-2 text-md">
                                                <p className="text-[16px]">{data?.name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <img
                                            className="w-10 h-10 rounded-md"
                                            src={IMAGES.playaidrop}
                                            alt=""
                                        />
                                        <div>
                                            <p className="text-[20px]">20</p>
                                            <p className="text-[12px]">$PLAI</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full gap-0">
                            <Button
                                className="uppercase w-full bg-[#181818] text-[#fff] hover:text-[#fff] hover:bg-[#171717]"
                                onClick={() => setIsOpen(false)}
                            >
                                cancel
                            </Button>
                            <Button
                                className="uppercase w-full"
                                onClick={() => handleRedirectToX()}
                            >
                                <ChevronRight className="w-4 h-4" color="#000" />
                                connect
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            )}
        </Dialog>
    );
}

export default VerifyTwitter