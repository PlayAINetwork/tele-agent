import { SquareChevronDown, SquareChevronUp } from 'lucide-react';
import React, { ReactNode, useState } from 'react'

const Collapsible = ({ children, titel, subtext }: { children: ReactNode, titel: string, subtext: string }) => {

    const [show, setShow] = useState(false);

    return (
        <div className='border-[1px] border-primary bg-card   '>

            <div className={`flex cursor-pointer px-4 gap-3 py-2 ${show ? "border-b-[1px]" : ""} border-primary `} onClick={() => setShow(!show)}>
                {
                    show ?
                        <SquareChevronUp />
                        : <SquareChevronDown />
                }
                <p className="text-lg uppercase ">
                    {titel}
                </p>
            </div>
            {
                show ? <div className=''>

                    {children}
                </div>
                    : <div className='px-4 pb-2'>
                        <p className="text-sm text-[#B6B6B6] uppercase ">
                            {subtext}
                        </p>
                    </div>



            }



        </div>
    )
}

export default Collapsible
