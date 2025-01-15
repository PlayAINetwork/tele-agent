import Navbar from "@/components/Home/Navbar";
import AgentCard from "@/components/Home/AgentCard";
import CourseCarousel from "@/components/Home/Carousel";
import useGetAgents from "@/hooks/api/agents/useGetAgents";


const Home = () => {
  const {agents}= useGetAgents()



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
            {agents?.result?.map((agent, index) => (
              <AgentCard key={index} data={agent} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
