import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CMSProvider } from './context/CMSContext';

export default function App() {
  return (
    <AuthProvider>
      <CMSProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </CMSProvider>
    </AuthProvider>
  );
}
