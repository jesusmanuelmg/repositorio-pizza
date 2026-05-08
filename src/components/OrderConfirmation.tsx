import { CheckCircle, Clock, Pizza } from 'lucide-react';

interface OrderConfirmationProps {
  orderId: string;
  onNewOrder: () => void;
}

export default function OrderConfirmation({ orderId, onNewOrder }: OrderConfirmationProps) {
  const shortId = orderId.slice(0, 8).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pedido confirmado</h1>
        <p className="text-gray-500 mb-6">Tu pizza está en camino. Gracias por tu pedido.</p>

        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <div className="text-xs text-gray-400 mb-1">Numero de pedido</div>
          <div className="text-lg font-mono font-bold text-gray-900">#{shortId}</div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: CheckCircle, label: 'Confirmado', color: 'text-green-600 bg-green-50' },
            { icon: Pizza, label: 'Preparando', color: 'text-orange-500 bg-orange-50' },
            { icon: Clock, label: 'En camino', color: 'text-blue-500 bg-blue-50' },
          ].map((step, i) => (
            <div key={i} className={`rounded-xl p-3 ${i === 0 ? step.color : 'text-gray-300 bg-gray-50'}`}>
              <step.icon className="w-6 h-6 mx-auto mb-1" />
              <div className="text-xs font-medium">{step.label}</div>
            </div>
          ))}
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Tiempo estimado de entrega: <span className="font-semibold text-gray-800">30 – 45 min</span>
        </p>

        <button
          onClick={onNewOrder}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-semibold transition-colors"
        >
          Hacer otro pedido
        </button>
      </div>
    </div>
  );
}
