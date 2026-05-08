import { useState } from 'react';
import type { Pizza, Topping, CartItem } from '../lib/types';
import PizzaCard from './PizzaCard';
import PizzaCustomizer from './PizzaCustomizer';

interface MenuProps {
  pizzas: Pizza[];
  toppings: Topping[];
  onAddToCart: (item: CartItem) => void;
}

const CATEGORIES = [
  { key: 'all', label: 'Todas' },
  { key: 'classic', label: 'Clásicas' },
  { key: 'specialty', label: 'Especiales' },
  { key: 'veggie', label: 'Veggie' },
];

export default function Menu({ pizzas, toppings, onAddToCart }: MenuProps) {
  const [category, setCategory] = useState('all');
  const [customizing, setCustomizing] = useState<Pizza | null>(null);

  const filtered = category === 'all' ? pizzas : pizzas.filter(p => p.category === category);

  return (
    <section id="menu" className="py-12 px-4 max-w-6xl mx-auto">
      {/* Section title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Nuestro menú</h2>
        <p className="text-gray-500 mt-1">Pizzas artesanales preparadas con ingredientes frescos</p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              category === cat.key
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(pizza => (
          <PizzaCard key={pizza.id} pizza={pizza} onCustomize={setCustomizing} />
        ))}
      </div>

      {/* Customizer modal */}
      {customizing && (
        <PizzaCustomizer
          pizza={customizing}
          toppings={toppings}
          onClose={() => setCustomizing(null)}
          onAddToCart={item => {
            onAddToCart(item);
            setCustomizing(null);
          }}
        />
      )}
    </section>
  );
}
