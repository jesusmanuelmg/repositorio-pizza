import { Plus, Star } from 'lucide-react';
import type { Pizza } from '../lib/types';

interface PizzaCardProps {
  pizza: Pizza;
  onCustomize: (pizza: Pizza) => void;
}

export default function PizzaCard({ pizza, onCustomize }: PizzaCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="relative overflow-hidden h-48">
        <img
          src={pizza.image_url}
          alt={pizza.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {pizza.popular && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-current" />
            Popular
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full capitalize">
          {pizza.category === 'veggie' ? 'Veggie' : pizza.category === 'specialty' ? 'Especial' : 'Clásica'}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg leading-tight">{pizza.name}</h3>
        <p className="text-gray-500 text-sm mt-1 leading-relaxed line-clamp-2">{pizza.description}</p>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xs text-gray-400">Desde</span>
            <div className="text-xl font-bold text-gray-900">${pizza.base_price.toFixed(2)}</div>
          </div>
          <button
            onClick={() => onCustomize(pizza)}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Personalizar
          </button>
        </div>
      </div>
    </div>
  );
}
