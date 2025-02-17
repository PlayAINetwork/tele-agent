import { createBrowserRouter } from 'react-router-dom'
// import { AppLayout } from "../layouts/app.layout";
import { ROUTES } from './router'
import Home from '@/pages/Home'
import AdminGenrate from '@/pages/AdminGenrate'
import AppLayout from '@/layouts/AppLayout'
import CreateWithRogue from '@/pages/CreateWithRogue'
import Features from '@/pages/Features'
import { Staking } from '@/pages/Staking'
import Terminal from '@/pages/Terminal'
import RoguePage from '@/pages/RoguePage'
import CreateRogueVedio from '@/pages/CreateRogueVedio'

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
        path: ROUTES.nodes.createWithRogue,
        element: <CreateWithRogue />,
      },
      {
        path: ROUTES.nodes.features,
        element: <Features />,
      },
      {
        path: ROUTES.nodes.staking,
        element: <Staking />,
      },
      {
        path: ROUTES.nodes.terminal,
        element: <Terminal />,
      },
      {
        path: ROUTES.nodes.rogue,
        element: <RoguePage />,
      },
      {
        path: ROUTES.nodes.createVedio,
        element: <CreateRogueVedio />,
      },
    ],
  },
])

export default router
