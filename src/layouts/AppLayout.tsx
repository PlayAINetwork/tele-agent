import Header from "@/components/app/Header";
import Footer from "@/components/app/Footer";
import { Outlet, useLocation } from "react-router-dom";
import { IMAGES } from "@/assets";

function AppLayout() {
  const {pathname} = useLocation();
  // const [isMobile, setIsMobile] = useState(false);


  // useEffect(() => {
  //   // Function to check if screen width is mobile
  //   const checkIsMobile = () => {
  //     // setIsMobile(window.innerWidth <= 768);
  //   };

  //   // Check initially
  //   checkIsMobile();

  //   // Add event listener for window resize
  //   window.addEventListener("resize", checkIsMobile);

  //   // Cleanup
  //   return () => window.removeEventListener("resize", checkIsMobile);
  // }, []);

  return (
    <main className={`h-[100vh]  realtive  flex flex-col overflow-hidden`}>

      <div className="flex flex-col flex-1 h-full">
        <Header />

        <div className={`flex-1 flex flex-col relative z-[1] overflow-y-hidden w-[100%] ${pathname !== "/"  ?"max-w-[1500px] mx-auto" :""} py-6 `}>
          {
            pathname !== "/" && (
              <div className="absolute w-full h-full opacity-50">
              <img src={IMAGES.bg} alt="" className="h-full"/>
            </div>
            )
          }
         
          <div className={`relative z-[1]  h-full w-full ${pathname === "/" ? "p-0" : "p-10"}`}>
          <Outlet />

          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}

export default AppLayout;
