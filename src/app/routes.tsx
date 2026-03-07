import { createBrowserRouter } from 'react-router';
import { Layout } from './Layout';
import { Home } from './pages/Home';
import { Explorar } from './pages/Explorar';
import { PropertyDetail } from './pages/PropertyDetail';
import { Anunciar } from './pages/Anunciar';
import { Contact } from './pages/Contact';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminSections from './pages/AdminSections';
import Setup from './pages/Setup';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "explorar",
        element: <Explorar />,
      },
      {
        path: "imovel/:id",
        element: <PropertyDetail />,
      },
      {
        path: "anunciar",
        element: <Anunciar />,
      },
      {
        path: "contato",
        element: <Contact />,
      },
      {
        path: "admin",
        element: <Admin />,
      },
      {
        path: "admin/login",
        element: <AdminLogin />,
      },
      {
        path: "admin/sections",
        element: <AdminSections />,
      },
      {
        path: "setup",
        element: <Setup />,
      },
      {
        path: "*",
        element: (
          <div className="pt-32 pb-24 text-center min-h-screen flex items-center justify-center">
            <div>
              <h1 className="text-4xl font-extralight text-[#0A1929] mb-4">404</h1>
              <p className="text-[#0A1929]/60 font-light">Página não encontrada</p>
            </div>
          </div>
        ),
      },
    ],
  },
]);