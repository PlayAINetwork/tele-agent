
const TvPanel = () => {
  return (
    <div className=" relative border-[1px] border-primary  place-content-center  w-full place-items-center  ">
     <div className="absolute w-4 h-4 bg-primary left-[-10px] top-[-10px]"></div>
     <div className="absolute w-4 h-4 bg-primary right-[-10px] top-[-10px]"></div>
     <div className="absolute w-4 h-4 bg-primary left-[-10px] bottom-[-10px]"></div>

      {/* <TvConsole /> */}
    </div>
  );
};

export default TvPanel;
