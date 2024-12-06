import { RouterProvider } from "react-router-dom";
import { IMAGES } from "./assets";
import Sidebar from "./components/Sidebar";
import TvPanel from "./components/TvPanel";
import { useAppCtx } from "./context/app.contex";
import { cn } from "./lib/utils";
import router from "./routes/routes";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
