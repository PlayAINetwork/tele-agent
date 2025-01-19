import Navbar from "@/components/Home/Navbar";
import AgentCard from "@/components/Home/AgentCard";
import CourseCarousel from "@/components/Home/Carousel";
import useGetAgents from "@/hooks/api/agents/useGetAgents";
import { Skeleton } from "@/components/ui/skeleton";


const Home = () => {
  const {agents,loadingAgent}= useGetAgents()



  return (
    <div className="h-full w-full flex binaria relative">
      <Navbar />
      <div className="w-full h-full overflow-y-scroll">
        <div className="h-[450px] relative">
          <CourseCarousel />
        </div>

        <div className="px-4  py-6">
          <div className=" py-4 text-lg  uppercase">
            <p>new agents</p>
          </div>
          <div className="grid grid-cols-4 gap-3  ">

           
            {
          
            loadingAgent?

            [...Array(8)].map((_, index) => (

              <div className=" border-primary border-[0.5px] relative h-[200px]" key={index}>
              <Skeleton  className="w-full min-h-[100%] bg-gray-700"/>

              <div className="absolute bottom-0 left-0 right-0 p-3 py-2 bg-card border-primary border-[0.5px] max-h-[60px] min-h-[30px]">
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <div className="w-8 h-8 rounded-md bg-gray-700 animate-pulse" />
                      <div className="flex flex-col gap-1">
                        <div className="h-3 w-16 bg-gray-700 rounded animate-pulse" />
                      </div>
                    </div>

                    <div className="flex gap-6 text-sm h-full">
                     
                      <div className="flex">
                        <div>
                          <div className="h-2 w-14 bg-gray-700 rounded animate-pulse mb-2" />
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className="w-4 h-4 bg-gray-700 rounded animate-pulse" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            )):
            
            agents?.result?.map((agent, index) => (
              <AgentCard key={index} data={agent} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
