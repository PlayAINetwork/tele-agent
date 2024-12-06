import { createBrowserRouter } from 'react-router-dom'
// import { AppLayout } from "../layouts/app.layout";
import { ROUTES } from './router'
import Home from '@/pages/Home'
import AdminGenrate from '@/pages/AdminGenrate'

const router = createBrowserRouter([
  {
    path: '/',
    // element: <AppLayout />,
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
    ],
  },
])

export default router
