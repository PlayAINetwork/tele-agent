import Navbar from "@/components/Home/Navbar";
import AgentCard from "@/components/Home/AgentCard";
import CourseCarousel from "@/components/Home/Carousel";


const Home = () => {
  const courses = [
    {
      title: "internal medicine i",
      image:
        "https://static.independent.co.uk/2024/11/07/20/newFile-1.jpg",
      description:
        "Explore the intricacies of diagnosing and treating adult diseases...",
    },
    {
      title: "biomedical technology",
      image:
        "https://static.independent.co.uk/2024/11/07/20/newFile-1.jpg",
      description: "Discover cutting-edge advancements in medical devices...",
    },
    {
      title: "introduction to data analytics",
      image:
        "https://static.independent.co.uk/2024/11/07/20/newFile-1.jpg",
      description: "Unlock the power of data and gain in-demand skills...",
    },
    {
      title: "biomedical technology",
      image:
        "https://static.independent.co.uk/2024/11/07/20/newFile-1.jpg",
      description: "Discover cutting-edge advancements in medical devices...",
    },
    {
      title: "introduction to data analytics",
      image:
        "https://static.independent.co.uk/2024/11/07/20/newFile-1.jpg",
      description: "Unlock the power of data and gain in-demand skills...",
    },
    {
      title: "biomedical technology",
      image:
        "https://static.independent.co.uk/2024/11/07/20/newFile-1.jpg",
      description: "Discover cutting-edge advancements in medical devices...",
    },
    {
      title: "introduction to data analytics",
      image:
        "https://static.independent.co.uk/2024/11/07/20/newFile-1.jpg",
      description: "Unlock the power of data and gain in-demand skills...",
    },
    
  ];

  return (
    <div className="h-full w-full flex binaria relative">
      <Navbar />
      <div className="w-full h-full overflow-scroll">
        <div className="h-[450px] relative">
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
