import { IMAGES } from "@/assets";
import Footer from "@/components/app/Footer";
import Header from "@/components/app/Header";
import Sidebar from "@/components/Sidebar";
import TvPanel from "@/components/TvPanel";

const Home = () => {
  return (
    <main
      className={`h-[100vh]  flex flex-col `}
      // className={cn(
      //   "grid min-h-[100dvh] -md:grid-cols-1",
      //   hideSidebar ? "grid-cols-[1fr_50px]" : "grid-cols-[1fr_300px]"
      // )}
    >
       <div className="absolute h-full w-[100%] top-0 z-[-1] opacity-[.2]">
              <img src={IMAGES.net} alt="" className="h-full" />
            </div>
      <Header />

      <div className="flex flex-1 p-6 gap-6">
        <TvPanel />
        <Sidebar />
      </div>
      <Footer />
    </main>
  );
};

export default Home;
