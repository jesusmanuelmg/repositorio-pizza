import { useState } from 'react';
import { ArrowLeft, MapPin, Phone, User, MessageSquare, CheckCircle, Loader } from 'lucide-react';
import type { CartItem } from '../lib/types';
import { supabase } from '../lib/supabase';

interface CheckoutProps {
  items: CartItem[];
  onBack: () => void;
  onSuccess: (orderId: string) => void;
}

export default function Checkout({ items, onBack, onSuccess }: CheckoutProps) {
  const [form, setForm] = useState({ name: '', phone: '', address: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const delivery = 2.99;
  const total = subtotal + delivery;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_address: form.address,
          notes: form.notes,
          total,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError || !order) throw orderError ?? new Error('No order returned');

      // Create order items
      for (const item of items) {
        const { data: orderItem, error: itemError } = await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            pizza_id: item.pizza.id,
            pizza_name: item.pizza.name,
            size: item.size,
            quantity: item.quantity,
            unit_price: item.unitPrice,
          })
          .select()
          .single();

        if (itemError || !orderItem) throw itemError ?? new Error('No item returned');

        // Create toppings for item
        if (item.toppings.length > 0) {
          const { error: toppingsError } = await supabase
            .from('order_item_toppings')
            .insert(
              item.toppings.map(t => ({
                order_item_id: orderItem.id,
                topping_id: t.id,
                topping_name: t.name,
                price: t.price,
              }))
            );
          if (toppingsError) throw toppingsError;
        }
      }

      onSuccess(order.id);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al procesar tu pedido. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Volver al carrito</span>
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Completar pedido</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Contact info */}
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-900">Datos de contacto</h2>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                <User className="w-3.5 h-3.5" /> Nombre completo *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Juan García"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                <Phone className="w-3.5 h-3.5" /> Teléfono *
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+1 555 000 0000"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                <MapPin className="w-3.5 h-3.5" /> Dirección de entrega *
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Calle Principal 123, Ciudad"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Notas (opcional)
              </label>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={2}
                placeholder="Instrucciones especiales, timbre, etc."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-3">Resumen del pedido</h2>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium">{item.quantity}x {item.pizza.name}</span>
                    <span className="text-gray-400 ml-1 capitalize">({item.size === 'small' ? 'personal' : item.size === 'medium' ? 'mediana' : 'grande'})</span>
                  </div>
                  <span className="font-medium">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span><span>${delivery.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1.5 border-t">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Procesando...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Confirmar pedido · ${total.toFixed(2)}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
