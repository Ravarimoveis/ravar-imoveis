import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { MapPin, BedDouble, Bath, Car, Square, Minus, CheckCircle2, ShieldCheck, Dog, Phone, Calendar, Image as ImageIcon, Play, Coffee, PlusSquare, Fuel, ShoppingBag } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { formatCurrency } from '../data/properties';
import { useProperties } from '../hooks/useProperties';

export function PropertyDetail() {
  const { id } = useParams();
  const { properties, loading } = useProperties();
  const property = properties.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);

  // Scroll to top quando abrir a página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <p className="text-[#0A1929]/60">Carregando imóvel...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <p className="text-[#0A1929]/60">Imóvel não encontrado</p>
      </div>
    );
  }

  const isAluguel = property.type === 'Aluguel';
  const totalValue = isAluguel ? (property.price + (property.condo || 0) + (property.iptu || 0)) : property.price;
  const hasGallery = property.images && property.images.length > 0;
  const displayImages = hasGallery ? property.images : [property.image];

  const openWhatsApp = () => {
    const msg = encodeURIComponent(`Olá, vi o imóvel "${property.title}" (Ref: ${property.id}) no site da Ravar Imóveis e gostaria de agendar uma consulta.`);
    window.open(`https://api.whatsapp.com/send?phone=5511999999999&text=${msg}`, '_blank');
  };

  return (
    <div className="pt-32 pb-24 animate-in slide-in-from-bottom-4 duration-1000 bg-white">
      <div className="container mx-auto px-10 lg:px-20 text-left">
        
        <div className="flex flex-col md:flex-row justify-between items-start mb-16 gap-8 text-left">
          <div className="flex flex-col max-w-2xl text-left">
            <div className="flex items-center gap-3 mb-6 text-left">
              <span className="text-[#AF9042] text-[9px] font-light uppercase tracking-[0.4em] border-b border-[#AF9042] pb-1">Ref: {property.id}</span>
              <span className="text-[#0A1929]/30 text-[9px] font-light uppercase tracking-[0.4em] italic">Curadoria Rava Imóveis</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extralight text-[#0A1929] mb-4 leading-tight tracking-tight italic">{property.title}</h1>
            <p className="flex items-center gap-2 text-[#0A1929]/50 font-light text-[13px] tracking-widest uppercase">
              <MapPin size={16} strokeWidth={1} className="text-[#AF9042]" /> {property.neighborhood}, São Paulo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start text-left">
          
          <div className="lg:col-span-8 text-left">
            <div className="mb-12 group relative overflow-hidden rounded-sm shadow-xl">
               <img src={displayImages[selectedImage]} className="w-full h-[650px] object-cover transition-all duration-[3s] group-hover:scale-105" alt={property.title} />
               <div className="absolute bottom-10 left-10 flex gap-4">
                 <button className="bg-white/90 backdrop-blur-md px-10 py-4 text-[10px] font-light uppercase tracking-[0.3em] text-[#0A1929] hover:bg-[#0A1929] hover:text-white transition-all shadow-2xl flex items-center gap-3 border border-white/50">
                   <ImageIcon size={14} className="text-[#AF9042]" /> {displayImages.length} Fotos
                 </button>
                 <button className="bg-white/90 backdrop-blur-md px-10 py-4 text-[10px] font-light uppercase tracking-[0.3em] text-[#0A1929] hover:bg-[#0A1929] hover:text-white transition-all shadow-2xl flex items-center gap-3 border border-white/50">
                   <Play size={14} className="text-[#AF9042]" /> Vídeo
                 </button>
               </div>
            </div>

            {hasGallery && displayImages.length > 1 && (
              <div className="mb-12 overflow-x-auto">
                <div className="flex gap-4 pb-4">
                  {displayImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-32 h-24 rounded-sm overflow-hidden border-2 transition-all ${
                        selectedImage === idx ? 'border-[#AF9042] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} className="w-full h-full object-cover" alt={`${property.title} - ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-y border-gray-100 py-16 mb-20">
               <div className="flex flex-col gap-3 items-center text-center">
                 <Square size={20} strokeWidth={1} className="text-[#AF9042]" />
                 <span className="text-[9px] uppercase tracking-[0.3em] text-[#0A1929]/40 font-bold">Área Útil</span>
                 <span className="text-2xl font-light text-[#0A1929]">{property.area} m²</span>
               </div>
               <div className="flex flex-col gap-3 items-center text-center">
                 <BedDouble size={20} strokeWidth={1} className="text-[#AF9042]" />
                 <span className="text-[9px] uppercase tracking-[0.3em] text-[#0A1929]/40 font-bold">Suítes</span>
                 <span className="text-2xl font-light text-[#0A1929]">{property.suites}</span>
               </div>
               <div className="flex flex-col gap-3 items-center text-center">
                 <Bath size={20} strokeWidth={1} className="text-[#AF9042]" />
                 <span className="text-[9px] uppercase tracking-[0.3em] text-[#0A1929]/40 font-bold">Banheiros</span>
                 <span className="text-2xl font-light text-[#0A1929]">{property.baths}</span>
               </div>
               <div className="flex flex-col gap-3 items-center text-center">
                 <Car size={20} strokeWidth={1} className="text-[#AF9042]" />
                 <span className="text-[9px] uppercase tracking-[0.3em] text-[#0A1929]/40 font-bold">Vagas</span>
                 <span className="text-2xl font-light text-[#0A1929]">{property.parking}</span>
               </div>
            </div>

            <div className="mb-24 text-left">
              <div className="flex items-center gap-6 mb-10">
                <Minus className="text-[#AF9042]" />
                <h3 className="text-xl font-extralight text-[#0A1929] uppercase tracking-[0.4em]">O Imóvel</h3>
              </div>
              <p className="text-[#0A1929]/60 font-light text-[15px] leading-loose italic max-w-3xl mb-16 border-l border-[#AF9042]/20 pl-8">
                "{property.description}"
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-20 mb-20">
                {property.features?.map(f => (
                  <div key={f} className="flex items-center gap-4 text-[11px] font-light text-[#0A1929] border-b border-gray-50 pb-4 uppercase tracking-widest">
                    <CheckCircle2 size={14} strokeWidth={1} className="text-[#AF9042]" /> {f}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6 mb-10">
                <Minus className="text-[#AF9042]" />
                <h3 className="text-xl font-extralight text-[#0A1929] uppercase tracking-[0.4em]">Infraestrutura do Prédio</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-20 mb-20 p-10 bg-slate-50/50 rounded-sm">
                {property.amenities?.map(a => (
                  <div key={a} className="flex items-center gap-4 text-[11px] font-light text-[#0A1929] uppercase tracking-widest">
                    <ShieldCheck size={14} strokeWidth={1} className="text-[#AF9042]" /> {a}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-6 mb-10">
                <Minus className="text-[#AF9042]" />
                <h3 className="text-xl font-extralight text-[#0A1929] uppercase tracking-[0.4em]">Diferenciais & Facilidades</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                <div className="flex items-center gap-6 p-8 border border-gray-100 rounded-sm group">
                   <Dog size={24} className="text-[#AF9042] group-hover:scale-110 transition-transform" />
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A1929]">Pet Friendly</p>
                     <p className="text-[11px] font-light text-[#0A1929]/60 italic">{property.petPolicy}</p>
                   </div>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-10">
                <Minus className="text-[#AF9042]" />
                <h3 className="text-xl font-extralight text-[#0A1929] uppercase tracking-[0.4em]">Vida no Entorno</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 text-center">
                <div className="flex flex-col items-center gap-4 p-8 border border-gray-100 rounded-sm hover:border-[#AF9042] transition-colors group">
                   <Coffee size={24} className="text-[#AF9042] group-hover:scale-110 transition-transform" />
                   <span className="text-[10px] font-light uppercase tracking-widest text-[#0A1929]">Padarias</span>
                </div>
                <div className="flex flex-col items-center gap-4 p-8 border border-gray-100 rounded-sm hover:border-[#AF9042] transition-colors group">
                   <PlusSquare size={24} className="text-[#AF9042] group-hover:scale-110 transition-transform" />
                   <span className="text-[10px] font-light uppercase tracking-widest text-[#0A1929]">Farmácias</span>
                </div>
                <div className="flex flex-col items-center gap-4 p-8 border border-gray-100 rounded-sm hover:border-[#AF9042] transition-colors group">
                   <Fuel size={24} className="text-[#AF9042] group-hover:scale-110 transition-transform" />
                   <span className="text-[10px] font-light uppercase tracking-widest text-[#0A1929]">Postos</span>
                </div>
                <div className="flex flex-col items-center gap-4 p-8 border border-gray-100 rounded-sm hover:border-[#AF9042] transition-colors group">
                   <ShoppingBag size={24} className="text-[#AF9042] group-hover:scale-110 transition-transform" />
                   <span className="text-[10px] font-light uppercase tracking-widest text-[#0A1929]">Mercados</span>
                </div>
              </div>

              <div className="h-[450px] bg-slate-100 rounded-sm relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-[3s]">
                 <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover opacity-30" alt="Mapa" />
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-white p-6 shadow-2xl rounded-sm flex flex-col items-center">
                     <MapPin size={32} className="text-[#AF9042] mb-2 animate-bounce" />
                     <p className="text-[11px] font-light uppercase tracking-widest text-[#0A1929]">{property.neighborhood}</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 self-start sticky top-32">
            <div className="space-y-8 pb-20">
              <div className="p-10 border border-gray-100 rounded-sm bg-[#FCFCFC] shadow-sm">
                 <span className="text-[10px] font-light uppercase tracking-[0.4em] text-[#AF9042] mb-2 block italic">
                   {isAluguel ? 'Pacote Total Mensal' : 'Valor de Investimento'}
                 </span>
                 <h2 className="text-3xl font-light text-[#0A1929] mb-6">{formatCurrency(totalValue)}</h2>
                 <div className="flex flex-col gap-2 text-[11px] font-light text-[#0A1929]/50 uppercase tracking-[0.1em] border-t border-gray-100 pt-6">
                    <div className="flex justify-between"><span>{isAluguel ? 'Aluguel' : 'Valor'}</span> <span>{formatCurrency(property.price)}</span></div>
                    <div className="flex justify-between"><span>Condomínio</span> <span>{formatCurrency(property.condo)}</span></div>
                    <div className="flex justify-between"><span>IPTU Mensal</span> <span>{formatCurrency(property.iptu)}</span></div>
                 </div>
              </div>
              <div className="bg-[#0A1929] p-12 rounded-sm shadow-2xl relative overflow-hidden">
                <div className="mb-10">
                  <p className="text-white text-[14px] font-light leading-tight">Quer saber mais</p>
                  <p className="text-[#AF9042] text-[14px] font-light leading-tight">sobre este imóvel?</p>
                </div>
                <div className="space-y-6 mb-12">
                  <button onClick={openWhatsApp} className="w-full bg-[#AF9042] text-white py-6 text-[10px] font-light uppercase tracking-[0.3em] hover:bg-white hover:text-[#0A1929] transition-all flex items-center justify-center gap-3 shadow-xl border border-[#AF9042]">
                    <FaWhatsapp size={18} className="text-white" /> WhatsApp
                  </button>
                  <button className="w-full border border-white/20 text-white py-6 text-[10px] font-light uppercase tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                    <Calendar size={16} strokeWidth={1} className="text-[#AF9042]" /> Agendar Visita
                  </button>
                </div>
                <div className="pt-10 border-t border-white/10 flex items-center gap-6">
                  <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 grayscale opacity-40">
                    <ShieldCheck size={24} className="text-[#AF9042]" strokeWidth={1} />
                  </div>
                  <div>
                    <p className="text-[10px] font-light uppercase tracking-widest text-[#AF9042] mb-1">Especialista Rava</p>
                    <p className="text-[11px] font-light text-white/50 italic tracking-wide">Consultoria Bilíngue 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}