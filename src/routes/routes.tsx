import { createBrowserRouter } from 'react-router-dom'
// import { AppLayout } from "../layouts/app.layout";
import { ROUTES } from './router'
import Home from '@/pages/Home'
import AdminGenrate from '@/pages/AdminGenrate'
import LeaderBoard from '@/pages/LeaderBoard'
import AppLayout from '@/layouts/AppLayout'
import Agent from '@/pages/Agent'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <Home />,
    children: [
      {
        path: ROUTES.nodes.global,
        element: <Home />,
      },
      {
        path: ROUTES.nodes.adminGenerate,
        element: <AdminGenrate />,
      },
      {
        path: ROUTES.nodes.rogueagent,
        element: <LeaderBoard />,
      },
      {
        path: ROUTES.nodes.agent,
        element: <Agent />,
      },
      
    ],
  },
])

export default router
