import { IMAGES } from '@/assets';
import Sidebar from '@/components/Sidebar'
import TvPanel from '@/components/TvPanel'
import { useAppCtx } from '@/context/app.contex';
import { cn } from '@/lib/utils';

const Home = () => {
    const { hideSidebar } = useAppCtx();
  return (
    <main
    className={cn(
      "grid min-h-[100dvh] -md:grid-cols-1",
      hideSidebar ? "grid-cols-[1fr_50px]" : "grid-cols-[1fr_300px]"
    )}
  >
    <div className="absolute bottom-0 w-full">
      <img src={IMAGES.img_bg} alt="" className="w-full" />
    </div>
    <TvPanel />
    <Sidebar />
  </main>
  )
}

export default Home