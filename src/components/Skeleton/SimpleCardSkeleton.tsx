
const SimpleCardSkeleton = () => {
  return (
    <div className="   py-2  max-h-[60px] min-h-[30px]">
    <div className="flex justify-between">
      <div className="flex gap-2 items-center">
        <div className="w-10 h-10 rounded-md bg-gray-700 animate-pulse" />
        <div className="flex flex-col gap-1">
          <div className="h-3 w-16 bg-gray-700 rounded animate-pulse" />

          <div className="h-3 w-24 bg-gray-700 rounded animate-pulse" />
        </div>
      </div>

      
    </div>
  </div>
  )
}

export default SimpleCardSkeleton