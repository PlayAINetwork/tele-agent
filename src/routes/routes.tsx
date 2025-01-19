import { createBrowserRouter } from 'react-router-dom'
// import { AppLayout } from "../layouts/app.layout";
import { ROUTES } from './router'
import Home from '@/pages/Home'
import AdminGenrate from '@/pages/AdminGenrate'
import LeaderBoard from '@/pages/LeaderBoard'
import AppLayout from '@/layouts/AppLayout'
import Agent from '@/pages/Agent'
import Rogue from '@/pages/Rogue'
import ErrorBoundary from '@/components/app/ErrorBoundary'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorBoundary />,
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
        path: ROUTES.nodes.twitterAuth,
        element: <LeaderBoard />,
      },
      {
        path: ROUTES.nodes.agent,
        element: <Agent />,
      },
      {
        path: ROUTES.nodes.rogue,
        element: <Rogue />,
      },
      
      
    ],
  },
])

export default router
