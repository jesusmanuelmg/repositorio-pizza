import { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import type { Pizza, Topping, PizzaSize, CartItem } from '../lib/types';
import { SIZE_LABELS, SIZE_MULTIPLIERS } from '../lib/types';

interface PizzaCustomizerProps {
  pizza: Pizza;
  toppings: Topping[];
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

const TOPPING_CATEGORIES = [
  { key: 'meat', label: 'Carnes' },
  { key: 'veggie', label: 'Verduras' },
  { key: 'cheese', label: 'Quesos' },
];

export default function PizzaCustomizer({ pizza, toppings, onClose, onAddToCart }: PizzaCustomizerProps) {
  const [size, setSize] = useState<PizzaSize>('medium');
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [quantity, setQuantity] = useState(1);

  const basePrice = pizza.base_price * SIZE_MULTIPLIERS[size];
  const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const unitPrice = basePrice + toppingsPrice;
  const total = unitPrice * quantity;

  function toggleTopping(topping: Topping) {
    setSelectedToppings(prev =>
      prev.some(t => t.id === topping.id)
        ? prev.filter(t => t.id !== topping.id)
        : [...prev, topping]
    );
  }

  function handleAdd() {
    const item: CartItem = {
      id: crypto.randomUUID(),
      pizza,
      size,
      quantity,
      toppings: selectedToppings,
      unitPrice,
    };
    onAddToCart(item);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="relative h-48 flex-shrink-0">
          <img src={pizza.image_url} alt={pizza.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-1.5 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-2xl font-bold">{pizza.name}</h2>
            <p className="text-sm text-white/80">{pizza.description}</p>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-6">
          {/* Size */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Tamaño</h3>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(SIZE_LABELS) as PizzaSize[]).map(s => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`border-2 rounded-xl p-3 text-center transition-all ${
                    size === s
                      ? 'border-red-600 bg-red-50 text-red-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold text-sm capitalize">{s === 'small' ? 'Personal' : s === 'medium' ? 'Mediana' : 'Grande'}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{s === 'small' ? '20cm' : s === 'medium' ? '30cm' : '40cm'}</div>
                  <div className="text-sm font-bold mt-1">${(pizza.base_price * SIZE_MULTIPLIERS[s]).toFixed(2)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Toppings */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Ingredientes extra</h3>
            <p className="text-xs text-gray-400 mb-3">Selecciona los que quieras agregar</p>
            {TOPPING_CATEGORIES.map(cat => {
              const catToppings = toppings.filter(t => t.category === cat.key);
              if (!catToppings.length) return null;
              return (
                <div key={cat.key} className="mb-4">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{cat.label}</div>
                  <div className="grid grid-cols-2 gap-2">
                    {catToppings.map(topping => {
                      const selected = selectedToppings.some(t => t.id === topping.id);
                      return (
                        <button
                          key={topping.id}
                          onClick={() => toggleTopping(topping)}
                          className={`flex items-center justify-between border rounded-xl px-3 py-2.5 transition-all ${
                            selected
                              ? 'border-red-600 bg-red-50 text-red-700'
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${selected ? 'bg-red-600' : 'border border-gray-300'}`}>
                              {selected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-sm font-medium">{topping.name}</span>
                          </div>
                          <span className="text-xs font-semibold">+${topping.price.toFixed(2)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-white flex items-center gap-4">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              <Minus className="w-4 h-4 text-gray-600" />
            </button>
            <span className="w-8 text-center font-bold text-gray-900">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="px-3 py-2 hover:bg-gray-50 transition-colors"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-between px-4"
          >
            <span>Agregar al carrito</span>
            <span>${total.toFixed(2)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
