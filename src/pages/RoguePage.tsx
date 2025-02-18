import Sidebar from '@/components/Sidebar'
import TvPanel from '@/components/TvPanel'

const RoguePage = () => {
  return (
    <div className="flex flex-1 flex-col md:flex-row  w-full h-full p gap-6">
    <TvPanel />
    <Sidebar />
  </div>
  )
}

export default RoguePage