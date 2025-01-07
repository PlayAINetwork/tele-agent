import { IMAGES } from "@/assets";
import Navbar from "@/components/Home/Navbar";
import AgentCard from "@/components/Home/AgentCard";
import CourseCarousel from "@/components/Home/Carousel";

import Sidebar from "@/components/Sidebar";
import TvPanel from "@/components/TvPanel";

const Home = () => {
  const courses = [
    {
      title: "internal medicine i",
      image:
        "https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      description:
        "Explore the intricacies of diagnosing and treating adult diseases...",
    },
    {
      title: "biomedical technology",
      image:
        "https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      description: "Discover cutting-edge advancements in medical devices...",
    },
    {
      title: "introduction to data analytics",
      image:
        "https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      description: "Unlock the power of data and gain in-demand skills...",
    },
    {
      title: "biomedical technology",
      image:
        "https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      description: "Discover cutting-edge advancements in medical devices...",
    },
    {
      title: "introduction to data analytics",
      image:
        "https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      description: "Unlock the power of data and gain in-demand skills...",
    },
    {
      title: "biomedical technology",
      image:
        "https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      description: "Discover cutting-edge advancements in medical devices...",
    },
    {
      title: "introduction to data analytics",
      image:
        "https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      description: "Unlock the power of data and gain in-demand skills...",
    },
    
  ];

  return (
    <div className="h-full w-full flex binaria relative">
      <Navbar />
      <div className="w-full h-full overflow-scroll">
        <div className="h-[350px] relative">
          <CourseCarousel />
        </div>

        <div className="px-4  py-6">
          <div className=" py-4 text-lg  uppercase">
            <p>new agents</p>
          </div>
          <div className="grid grid-cols-4 gap-3  ">
            {courses.map((course, index) => (
              <AgentCard key={index} data={course} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
