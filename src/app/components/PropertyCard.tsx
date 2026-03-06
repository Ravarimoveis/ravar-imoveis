import { BedDouble, Bath, Car, Square, Heart } from 'lucide-react';
import { formatCurrency } from '../data/properties';

interface PropertyCardProps {
  prop: any;
  onNavigate: () => void;
}

export function PropertyCard({ prop, onNavigate }: PropertyCardProps) {
  const isAluguel = prop.type === 'Aluguel';
  const totalValue = isAluguel ? (prop.price + (prop.condo || 0) + (prop.iptu || 0)) : prop.price;
  const priceDisplay = formatCurrency(totalValue);
  const isSobConsulta = priceDisplay === 'Sob Consulta';
  
  return (
    <div className="group cursor-pointer text-left" onClick={onNavigate}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-sm mb-6 shadow-sm group-hover:shadow-xl transition-all duration-700">
        <img src={prop.image} className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-105" alt={prop.title} />
        <div className="absolute top-6 left-6 flex gap-2">
          <span className="bg-white/90 backdrop-blur px-3 py-1 text-[8px] font-light uppercase tracking-widest text-[#0A1929] border border-gray-100">{prop.type}</span>
        </div>
        <div className="absolute top-5 right-5">
          <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 shadow-xl">
            <Heart size={16} strokeWidth={1} />
          </button>
        </div>
      </div>
      <div className="flex flex-col px-1 text-left">
        <span className="text-[9px] font-light text-[#AF9042] uppercase tracking-[0.3em] mb-2">{prop.neighborhood}</span>
        <h3 className="text-xl font-extralight text-[#0A1929] mb-4 tracking-tight group-hover:text-[#AF9042] transition-colors">{prop.title}</h3>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-light text-[#0A1929]/60 italic mb-5 text-left">
          <div className="flex items-center gap-1.5"><BedDouble size={14} strokeWidth={1} className="text-[#AF9042]" /> {prop.rooms} qts</div>
          <div className="flex items-center gap-1.5"><Bath size={14} strokeWidth={1} className="text-[#AF9042]" /> {prop.baths} ban</div>
          <div className="flex items-center gap-1.5"><Car size={14} strokeWidth={1} className="text-[#AF9042]" /> {prop.parking} vagas</div>
          <div className="flex items-center gap-1.5"><Square size={14} strokeWidth={1} className="text-[#AF9042]" /> {prop.area} m²</div>
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#AF9042] mb-1 italic">{isAluguel ? 'Pacote Total Mensal' : 'Valor de Investimento'}</span>
          <span className="text-xl font-light text-[#0A1929] text-left">{priceDisplay}{!isSobConsulta && isAluguel && <span className="text-[10px] ml-1">/mês</span>}</span>
        </div>
      </div>
    </div>
  );
}