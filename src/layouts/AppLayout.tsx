import Header from "@/components/app/Header";
import Footer from "@/components/app/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { IMAGES } from "@/assets";


function AppLayout() {
  const {pathname} = useLocation();


  return (
    <main className={`h-[100vh]  realtive  flex flex-col overflow-hidden`}>
  
      <div className="flex flex-col flex-1 h-full">
        <Header />

        <div className={`flex-1 flex flex-col relative z-[1] overflow-y-hidden w-[100%] ${pathname !== "/"  ?"max-w-[1500px] mx-auto" :""}  md:py-6 `}>
          {
            pathname !== "/" && (
              <div className="absolute w-full h-full opacity-50">
              <img src={IMAGES.bg} alt="" className="h-full"/>
            </div>
            )
          }
         
          <div className={`relative z-[1] overflow-y-scroll md:overflow-auto h-full w-full `}>
          <div className={`${pathname === "/" ? "p-0" : "md:p-10 p-4 py-6"} h-full`}>

          <Outlet />
          </div>

          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}

export default AppLayout;
