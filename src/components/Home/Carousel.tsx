import React, { useState } from "react";

const CourseCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(2);
  const [orders, setOrders] = useState([5, 6, 0, 1, 2, 3, 4]);

  const courses = [
    {
      title: "agent roguei",
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
      title: "introduction to marketing",
      image:
        "https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      description: "Gain insights into consumer behavior...",
    },
    {
      title: "landscape & wildlife photography",
      image:
        "https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      description: "Capture breathtaking moments in nature...",
    },
    {
      title: "web development fundamentals",
      image:
        "https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      description: "Master the core technologies of modern web development...",
    },
    {
      title: "artificial intelligence basics",
      image:
        "https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      description: "Dive into the fascinating world of AI...",
    },
  ];

  const handlePrev = () => {
    setOrders((prevOrders) => {
      const newOrders = prevOrders.map((order) => (order + 1) % 7);
      return newOrders;
    });
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + courses.length) % courses.length
    );
  };

  const handleNext = () => {
    setOrders((prevOrders) => {
      const newOrders = prevOrders.map((order) => (order - 1 + 7) % 7);
      return newOrders;
    });
    setCurrentIndex((prevIndex) => (prevIndex + 1) % courses.length);
  };

  const getItemClasses = (order) => {
    const baseClasses =
      "absolute transition-all duration-500 ease-in-out cursor-pointer";
    switch (order) {
      case 0: // Focus (Center)
        return `${baseClasses} z-30 h-[85%] w-[38%] top-[5%] left-[30%]`;
      case 1: // Right Big
        return `${baseClasses} z-20 h-[75%] w-[34%] top-[10%] left-[46%]`;
      case 2: // Right Small
        return `${baseClasses} z-10 h-[65%] w-[30%] top-[15%] left-[60%]`;
      case 3: // Far Right
        return `${baseClasses} z-0 h-[55%] w-[26%] top-[20%] left-[72%] opacity-40`;
      case 4: // Far Left
        return `${baseClasses} z-0 h-[55%] w-[26%] top-[20%] left-[1%] opacity-40`;
      case 5: // Left Small
        return `${baseClasses} z-10 h-[65%] w-[30%] top-[15%] left-[8%]`;
      case 6: // Left Big
        return `${baseClasses} z-20 h-[75%] w-[34%] top-[10%] left-[18%]`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className="  h-full w-full  overflow-hidden">
       
      <div className="h-full w-full  mx-auto px-4 py-7  items-center">
      <div className=" py-0 px-4 text-lg  uppercase">
            <p>new agents</p>
          </div>
        <div className="relative w-full h-[100%]">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-[1%] top-1/2 -translate-y-1/2 text-3xl font-semibold cursor-pointer z-40 w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform bg-white/10 rounded-full backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <span className="block transform -translate-x-0.5">&lt;</span>
          </button>

          {/* Carousel Items */}
          <div className="relative w-full h-full">
            {courses.map((course, index) => (
              <div key={index} className={getItemClasses(orders[index])}>
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover r\ shadow-lg border border-white/50 transition-all duration-500"
                />
                {/* {orders[index] === 0 && ( */}
                <div className="absolute bottom-0 left-0 right-0 p-3 py-2 bg-card border border-white/50 ">
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <img
                        className="w-10  h-10 rounded-md"
                        src="https://images.unsplash.com/photo-1579226905180-636b76d96082?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
                        alt=""
                      />
                      <div className="flex flex-col gap-0">
                        <p className="text-white text-md font-semibold capitalize ">
                          agent rogue
                        </p>
                        <p className="text-white/80 text-sm  font-normal line-clamp-2">
                          $ROGUE
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                    <div className="flex">
                        <div>
                          <p>$234M</p>
                          <p className="font-normal text-xs uppercase text-[#D4D4D4]">
                            market cap
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        <div>
                          <p>$234M</p>
                          <p className="font-normal text-xs uppercase text-[#D4D4D4]">
                            market cap
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* )} */}
              </div>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="absolute right-[1%] top-1/2 -translate-y-1/2 text-3xl font-semibold cursor-pointer z-40 w-8 h-8 flex items-center justify-center hover:scale-110 transition-transform bg-white/10 rounded-full backdrop-blur-sm"
            aria-label="Next slide"
          >
            <span className="block transform translate-x-0.5">&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCarousel;
