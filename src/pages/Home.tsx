import { IMAGES } from "@/assets";
import Footer from "@/components/app/Footer";
import Header from "@/components/app/Header";
import Sidebar from "@/components/Sidebar";
import TvPanel from "@/components/TvPanel";

const Home = () => {
  return (
    <main
      className={`h-[100vh] realtive  flex flex-col overflow-hidden `}
      // className={cn(
      //   "grid min-h-[100dvh] -md:grid-cols-1",
      //   hideSidebar ? "grid-cols-[1fr_50px]" : "grid-cols-[1fr_300px]"
      // )}
    >
      <div className="absolute h-full flex w-[100%] top-[0] z-[-1]  items-center">
        <img src={IMAGES.bg} alt="" className="w-full" />
      </div>
      <Header />

      <div className="flex flex-1 p-6 py-14 gap-6">
        <TvPanel />
        <Sidebar />
      </div>
      <Footer />
    </main>
  );
};

export default Home;
