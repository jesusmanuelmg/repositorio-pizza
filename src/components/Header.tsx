import { ShoppingCart, Pizza } from 'lucide-react';
import type { CartItem } from '../lib/types';

interface HeaderProps {
  cartItems: CartItem[];
  onCartClick: () => void;
}

export default function Header({ cartItems, onCartClick }: HeaderProps) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-red-600 rounded-xl p-2">
            <Pizza className="text-white w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Bella</span>
            <span className="text-xl font-bold text-red-600 tracking-tight">Pizza</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="#menu" className="hover:text-red-600 transition-colors">Menu</a>
          <a href="#about" className="hover:text-red-600 transition-colors">Nosotros</a>
        </nav>

        <button
          onClick={onCartClick}
          className="relative flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors font-medium text-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="hidden sm:inline">Carrito</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
