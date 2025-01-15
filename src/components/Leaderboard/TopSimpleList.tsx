
const TopSimpleList = ({title,data,gain}:{title:string;data:any,gain:boolean}) => {
  return (
    <div className="     ">
      <div className="border p-2">
        <div className=" pb-4 text-sm  uppercase">
          <p>{title}</p>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-0 ">
          {
            data?.map((item:any)=>(
              <DataRow data={item} gain={gain}/>

            ))
          }
          


 
        </div>
      </div>
    </div>
  );
};

export default TopSimpleList;

const DataRow = ({data,gain}:{data:any,gain:boolean}) => (
  <div className="flex justify-between ">
    <div className=" gap-1 flex sticky min-w-[100px] max-w-[150px] truncate cursor-pointer">
      <img
        src={
         data?.image
        }
        alt={"agent.agentDetails.name"}
        className="w-5 h-5 inline-flex mr-1 mb-1"
      />
    {data?.name}
    </div>
    <div className=" pb-4 text-sm">
      <p>{gain ? "+" :"-" }{data?.percentageChange?.toFixed(2)}</p>
    </div>
  </div>
);
