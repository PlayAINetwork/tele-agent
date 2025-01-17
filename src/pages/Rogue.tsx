import { IMAGES } from '@/assets'
import OldSidebar from '@/components/Sidebar/oldSidebar'
import TvPanel from '@/components/TvPanel'

const Rogue = () => {
    return (
        <div className="flex flex-1 p-6 h-full w-full relative py-14 gap-6 n">
            <div className="absolute h-full flex w-[100%] top-[0] left-0 z-[-1]  items-center">
                <img src={IMAGES.bg} alt="" className="w-full" />
            </div>
            <TvPanel />
            <OldSidebar />
        </div>
    )
}

export default Rogue
