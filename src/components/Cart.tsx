import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import type { CartItem } from '../lib/types';
import { SIZE_LABELS } from '../lib/types';

interface CartProps {
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export default function Cart({ items, onClose, onUpdateQuantity, onRemove, onCheckout }: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const delivery = subtotal > 0 ? 2.99 : 0;
  const total = subtotal + delivery;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold text-gray-900">Tu pedido</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">Tu carrito está vacío</p>
              <p className="text-gray-400 text-sm mt-1">Agrega algunas pizzas para comenzar</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <img
                    src={item.pizza.image_url}
                    alt={item.pizza.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">{item.pizza.name}</h4>
                        <p className="text-xs text-gray-500">{SIZE_LABELS[item.size]}</p>
                      </div>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.toppings.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {item.toppings.map(t => (
                          <span key={t.id} className="bg-white text-gray-600 text-xs px-2 py-0.5 rounded-full border border-gray-200">
                            {t.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5 border border-gray-200 bg-white rounded-lg overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="text-sm font-bold text-gray-900 w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                      <span className="font-bold text-gray-900">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-5 space-y-3">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span>${delivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-semibold transition-colors"
            >
              Continuar al pago
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
