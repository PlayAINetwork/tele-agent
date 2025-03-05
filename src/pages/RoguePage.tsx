import Sidebar from '@/components/Sidebar'
import TvPanel from '@/components/TvPanel'

const RoguePage = () => {
  return (
    <div className="flex flex-1 flex-col md:flex-row  w-full h-full  gap-6">
    <TvPanel />
    <div className='pb-6 md:pb-0 min-h-[450px] md:h-full'>
    <Sidebar />

    </div>
  </div>
  )
}

export default RoguePage