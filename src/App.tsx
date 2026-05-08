import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import type { Pizza, Topping, CartItem } from './lib/types';
import Header from './components/Header';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';

type View = 'menu' | 'checkout' | 'confirmation';

export default function App() {
  const [pizzas, setPizzas] = useState<Pizza[]>([]);
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [view, setView] = useState<View>('menu');
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [{ data: pz }, { data: tp }] = await Promise.all([
        supabase.from('pizzas').select('*').order('popular', { ascending: false }),
        supabase.from('toppings').select('*').order('category'),
      ]);
      if (pz) setPizzas(pz);
      if (tp) setToppings(tp);
      setLoading(false);
    }
    load();
  }, []);

  function addToCart(item: CartItem) {
    setCart(prev => [...prev, item]);
    setCartOpen(true);
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      setCart(prev => prev.filter(i => i.id !== id));
    } else {
      setCart(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
    }
  }

  function removeItem(id: string) {
    setCart(prev => prev.filter(i => i.id !== id));
  }

  function handleCheckout() {
    setCartOpen(false);
    setView('checkout');
  }

  function handleSuccess(id: string) {
    setOrderId(id);
    setCart([]);
    setView('confirmation');
  }

  function handleNewOrder() {
    setView('menu');
    setOrderId('');
  }

  if (view === 'confirmation') {
    return <OrderConfirmation orderId={orderId} onNewOrder={handleNewOrder} />;
  }

  if (view === 'checkout') {
    return (
      <>
        <Header cartItems={cart} onCartClick={() => setView('menu')} />
        <Checkout items={cart} onBack={() => setView('menu')} onSuccess={handleSuccess} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItems={cart} onCartClick={() => setCartOpen(true)} />

      {/* Hero */}
      <section className="relative h-[420px] sm:h-[500px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/905847/pexels-photo-905847.jpeg?auto=compress&cs=tinysrgb&w=1260"
          alt="Pizza artesanal"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex items-center px-6 sm:px-12 max-w-6xl mx-auto">
          <div className="text-white max-w-lg">
            <div className="inline-block bg-red-600 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
              Entrega en 30 min
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
              Pizza artesanal<br />a tu puerta
            </h1>
            <p className="text-white/80 text-base sm:text-lg mb-6">
              Ingredientes frescos, masa casera y el sabor que te encanta.
            </p>
            <a
              href="#menu"
              className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
            >
              Ver el menú
            </a>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-5 grid grid-cols-3 gap-4 text-center text-sm">
          {[
            { label: 'Entrega rápida', detail: '30-45 minutos' },
            { label: 'Ingredientes frescos', detail: 'Todos los días' },
            { label: 'Personaliza tu pizza', detail: 'A tu gusto' },
          ].map(f => (
            <div key={f.label}>
              <div className="font-semibold text-gray-900">{f.label}</div>
              <div className="text-gray-400 text-xs mt-0.5">{f.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <Menu pizzas={pizzas} toppings={toppings} onAddToCart={addToCart} />
      )}

      {/* Footer */}
      <footer id="about" className="bg-gray-900 text-white mt-12 py-12 px-4">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-8">
          <div>
            <div className="text-xl font-bold mb-2">
              <span>Bella</span><span className="text-red-500">Pizza</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Pizzeria artesanal desde 1998. Masa madre, ingredientes seleccionados y recetas familiares.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Horarios</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>Lun – Jue: 12:00 – 22:00</li>
              <li>Vie – Sab: 12:00 – 23:30</li>
              <li>Dom: 13:00 – 21:00</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contacto</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>+1 (555) 123-4567</li>
              <li>info@bellapizza.com</li>
              <li>Calle Mayor 42, Ciudad</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-xs">
          © 2024 BellaPizza. Todos los derechos reservados.
        </div>
      </footer>

      {/* Cart drawer */}
      {cartOpen && (
        <Cart
          items={cart}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemove={removeItem}
          onCheckout={handleCheckout}
        />
      )}
    </div>
  );
}
