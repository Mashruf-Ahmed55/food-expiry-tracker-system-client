import App from '@/App';
import Layout from '@/components/layout/layout';
import AddFood from '@/pages/AddFood';
import FoodDetails from '@/pages/FoodDetails';
import Fridge from '@/pages/Fridge';
import Login from '@/pages/Login';
import MyItems from '@/pages/MyItems';
import NotFound from '@/pages/NotFound';
import Register from '@/pages/Register';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { default as AuthRoute } from './PrivateRoute';

export default function Router() {
  const router = createBrowserRouter([
    {
      path: '/',
      Component: Layout,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          Component: App,
        },
        {
          path: 'login',
          element: (
            <AuthRoute>
              <Login />
            </AuthRoute>
          ),
        },
        {
          path: 'register',
          element: (
            <AuthRoute>
              <Register />
            </AuthRoute>
          ),
        },
        {
          path: 'fridge',
          Component: Fridge,
        },
        {
          path: 'food/:id',
          Component: FoodDetails,
        },
        {
          path: 'add-food',
          element: (
            <AuthRoute isPrivate>
              <AddFood />
            </AuthRoute>
          ),
        },
        {
          path: 'my-items',
          element: (
            <AuthRoute isPrivate>
              <MyItems />
            </AuthRoute>
          ),
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
