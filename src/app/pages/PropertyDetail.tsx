import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { 
  MapPin, BedDouble, Bath, Car, Square, Minus, CheckCircle2, ShieldCheck, 
  Dog, Phone, Calendar, Image as ImageIcon, Play, Coffee, PlusSquare, Fuel, ShoppingBag,
  Home, Building, Waves, Dumbbell, Users, Baby, Bike, Wifi, Wind, Droplets, Trees,
  Camera, Sparkles, Sun, Mountain, Zap, UtensilsCrossed, GraduationCap, Hospital,
  Bus, Train, Plane, Building2, Church, Film, Music, Landmark
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { formatCurrency } from '../data/properties';
import { useProperties } from '../hooks/useProperties';
import marcaDagua from 'figma:asset/9e2879d89e5853f5fe9dc7ca1f55c2a3d20e82c6.png';

// Map icon names to actual icon components
const iconMap: { [key: string]: any } = {
  Dog, Home, Building, Car, Waves, Dumbbell, Users, Baby, Bike, Wifi, Wind, Droplets, 
  Trees, ShieldCheck, Camera, Sparkles, Sun, Mountain, MapPin, Zap,
  Coffee, ShoppingBag, PlusSquare, Fuel, UtensilsCrossed, GraduationCap, Hospital,
  Bus, Train, Plane, Building2, Church, Film, Music, Landmark
};

export function PropertyDetail() {
  const { id } = useParams();
  const { properties, loading } = useProperties();
  const property = properties.find(p => p.id === id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [mainImageLoaded, setMainImageLoaded] = useState(false);

  // Scroll to top quando abrir a página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset image loaded state when selectedImage changes
  useEffect(() => {
    setMainImageLoaded(false);
  }, [selectedImage]);

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

  const openWhatsAppInfo = () => {
    const msg = encodeURIComponent(`Olá! Vi o imóvel *${property.title}* (Ref: ${property.id}) no site da RAVAR Imóveis e gostaria de saber mais informações sobre este imóvel. Aguardo retorno!`);
    window.open(`https://api.whatsapp.com/send?phone=5511972013159&text=${msg}`, '_blank');
  };

  const openWhatsAppSchedule = () => {
    const msg = encodeURIComponent(`Olá! Vi o imóvel *${property.title}* (Ref: ${property.id}) no site da RAVAR Imóveis e gostei muito! Gostaria de agendar uma visita para conhecer pessoalmente. Quando podemos agendar?`);
    window.open(`https://api.whatsapp.com/send?phone=5511972013159&text=${msg}`, '_blank');
  };

  return (
    <div className="pt-32 pb-24 animate-in slide-in-from-bottom-4 duration-1000 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-20 text-left">
        
        <div className="flex flex-col md:flex-row justify-between items-start mb-12 md:mb-16 gap-6 md:gap-8 text-left">
          <div className="flex flex-col max-w-2xl text-left">
            <div className="flex items-center gap-3 mb-4 md:mb-6 text-left flex-wrap">
              <span className="text-[#AF9042] text-[9px] font-light uppercase tracking-[0.4em] border-b border-[#AF9042] pb-1">Ref: {property.id}</span>
              <span className="text-[#0A1929]/30 text-[9px] font-light uppercase tracking-[0.4em] italic">Curadoria Rava Imóveis</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extralight text-[#0A1929] mb-4 leading-tight tracking-tight italic">{property.title}</h1>
            <p className="flex items-center gap-2 text-[#0A1929]/50 font-light text-[13px] tracking-widest uppercase">
              <MapPin size={16} strokeWidth={1} className="text-[#AF9042]" /> {property.neighborhood}, São Paulo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-start text-left">
          
          <div className="lg:col-span-8 text-left">
            <div className="mb-8 md:mb-12 group relative overflow-hidden rounded-sm shadow-xl">
               <img 
                 src={displayImages[selectedImage]} 
                 className="w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] object-cover transition-all duration-[3s] group-hover:scale-105" 
                 alt={property.title} 
                 onLoad={() => setMainImageLoaded(true)}
               />
               
               {/* ✅ MARCA D'ÁGUA AUTOMÁTICA */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <img 
                   src={marcaDagua} 
                   alt="" 
                   className="w-[75%] sm:w-[67%] md:w-[60%] lg:w-[52%] opacity-20 select-none"
                 />
               </div>
               
               <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 md:bottom-10 md:left-10 flex flex-col sm:flex-row gap-2 sm:gap-4">
                 <button className="bg-white/90 backdrop-blur-md px-4 sm:px-6 md:px-10 py-3 md:py-4 text-[9px] sm:text-[10px] font-light uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#0A1929] hover:bg-[#0A1929] hover:text-white transition-all shadow-2xl flex items-center justify-center gap-2 sm:gap-3 border border-white/50">
                   <ImageIcon size={14} className="text-[#AF9042]" /> {displayImages.length} Fotos
                 </button>
                 <button className="bg-white/90 backdrop-blur-md px-4 sm:px-6 md:px-10 py-3 md:py-4 text-[9px] sm:text-[10px] font-light uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#0A1929] hover:bg-[#0A1929] hover:text-white transition-all shadow-2xl flex items-center justify-center gap-2 sm:gap-3 border border-white/50">
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
                      className={`flex-shrink-0 w-32 h-24 rounded-sm overflow-hidden border-2 transition-all relative ${
                        selectedImage === idx ? 'border-[#AF9042] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={img} 
                        loading="lazy"
                        className="w-full h-full object-cover" 
                        alt={`${property.title} - ${idx + 1}`} 
                      />
                      
                      {/* ✅ MARCA D'ÁGUA AUTOMÁTICA NAS THUMBNAILS */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <img 
                          src={marcaDagua} 
                          alt="" 
                          className="w-full opacity-30 select-none"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 border-y border-gray-100 py-12 md:py-16 mb-16 md:mb-20">
               <div className="flex flex-col gap-3 items-center text-center">
                 <Square size={20} strokeWidth={1} className="text-[#AF9042]" />
                 <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#0A1929]/40 font-bold">Área Útil</span>
                 <span className="text-xl md:text-2xl font-light text-[#0A1929]">{property.area} m²</span>
               </div>
               <div className="flex flex-col gap-3 items-center text-center">
                 <BedDouble size={20} strokeWidth={1} className="text-[#AF9042]" />
                 <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#0A1929]/40 font-bold">Suítes</span>
                 <span className="text-xl md:text-2xl font-light text-[#0A1929]">{property.suites}</span>
               </div>
               <div className="flex flex-col gap-3 items-center text-center">
                 <Bath size={20} strokeWidth={1} className="text-[#AF9042]" />
                 <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#0A1929]/40 font-bold">Banheiros</span>
                 <span className="text-xl md:text-2xl font-light text-[#0A1929]">{property.baths}</span>
               </div>
               <div className="flex flex-col gap-3 items-center text-center">
                 <Car size={20} strokeWidth={1} className="text-[#AF9042]" />
                 <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#0A1929]/40 font-bold">Vagas</span>
                 <span className="text-xl md:text-2xl font-light text-[#0A1929]">{property.parking}</span>
               </div>
            </div>

            <div className="mb-16 md:mb-24 text-left">
              <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10">
                <Minus className="text-[#AF9042]" />
                <h3 className="text-lg md:text-xl font-extralight text-[#0A1929] uppercase tracking-[0.3em] md:tracking-[0.4em]">O Imóvel</h3>
              </div>
              <p className="text-[#0A1929]/60 font-light text-[14px] md:text-[15px] leading-loose italic max-w-3xl mb-12 md:mb-16 border-l border-[#AF9042]/20 pl-4 md:pl-8">
                "{property.description}"
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-6 gap-x-12 md:gap-x-20 mb-16 md:mb-20">
                {property.features?.map(f => (
                  <div key={f} className="flex items-center gap-3 md:gap-4 text-[10px] md:text-[11px] font-light text-[#0A1929] border-b border-gray-50 pb-3 md:pb-4 uppercase tracking-wide md:tracking-widest">
                    <CheckCircle2 size={14} strokeWidth={1} className="text-[#AF9042] flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10">
                <Minus className="text-[#AF9042]" />
                <h3 className="text-lg md:text-xl font-extralight text-[#0A1929] uppercase tracking-[0.3em] md:tracking-[0.4em]">Infraestrutura do Prédio</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-y-6 gap-x-12 md:gap-x-20 mb-16 md:mb-20 p-6 md:p-10 bg-slate-50/50 rounded-sm">
                {property.amenities?.map(a => (
                  <div key={a} className="flex items-center gap-3 md:gap-4 text-[10px] md:text-[11px] font-light text-[#0A1929] uppercase tracking-wide md:tracking-widest">
                    <ShieldCheck size={14} strokeWidth={1} className="text-[#AF9042] flex-shrink-0" /> {a}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10">
                <Minus className="text-[#AF9042]" />
                <h3 className="text-lg md:text-xl font-extralight text-[#0A1929] uppercase tracking-[0.3em] md:tracking-[0.4em]">Diferenciais & Facilidades</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-24">
                {/* Render conveniences dynamically */}
                {property.conveniences && property.conveniences.length > 0 && property.conveniences.map((conv) => {
                  const IconComponent = iconMap[conv.icon] || Dog;
                  return (
                    <div key={conv.id} className="flex items-center gap-6 p-8 border border-gray-100 rounded-sm group">
                       <IconComponent size={24} className="text-[#AF9042] group-hover:scale-110 transition-transform" />
                       <div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-[#0A1929]">{conv.label}</p>
                         <p className="text-[11px] font-light text-[#0A1929]/60 italic">{conv.desc}</p>
                       </div>
                    </div>
                  );
                })}

                {/* Fallback message if no conveniences */}
                {(!property.conveniences || property.conveniences.length === 0) && (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-[11px] font-light text-[#0A1929]/40 italic">
                      Nenhum diferencial cadastrado para este imóvel
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-10">
                <Minus className="text-[#AF9042]" />
                <h3 className="text-lg md:text-xl font-extralight text-[#0A1929] uppercase tracking-[0.3em] md:tracking-[0.4em]">Vida no Entorno</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 text-center">
                {/* Render lifeAround dynamically */}
                {property.lifeAround && property.lifeAround.length > 0 ? (
                  property.lifeAround.map((life) => {
                    const IconComponent = iconMap[life.icon] || Coffee;
                    return (
                      <div key={life.id} className="flex flex-col items-center gap-4 p-8 border border-gray-100 rounded-sm hover:border-[#AF9042] transition-colors group">
                         <IconComponent size={24} className="text-[#AF9042] group-hover:scale-110 transition-transform" />
                         <span className="text-[10px] font-light uppercase tracking-widest text-[#0A1929]">{life.label}</span>
                      </div>
                    );
                  })
                ) : (
                  // Fallback to default items
                  <>
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
                  </>
                )}
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

          <div className="lg:col-span-4 self-start lg:sticky lg:top-32">
            <div className="space-y-6 md:space-y-8 pb-12 md:pb-20">
              <div className="p-6 md:p-10 border border-gray-100 rounded-sm bg-[#FCFCFC] shadow-sm">
                 <span className="text-[10px] font-light uppercase tracking-[0.3em] md:tracking-[0.4em] text-[#AF9042] mb-2 block italic">
                   {isAluguel ? 'Pacote Total Mensal' : 'Valor de Investimento'}
                 </span>
                 <h2 className="text-2xl md:text-3xl font-light text-[#0A1929] mb-4 md:mb-6">{formatCurrency(totalValue)}</h2>
                 <div className="flex flex-col gap-2 text-[10px] md:text-[11px] font-light text-[#0A1929]/50 uppercase tracking-[0.1em] border-t border-gray-100 pt-4 md:pt-6">
                    <div className="flex justify-between"><span>{isAluguel ? 'Aluguel' : 'Valor'}</span> <span>{formatCurrency(property.price)}</span></div>
                    <div className="flex justify-between"><span>Condomínio</span> <span>{formatCurrency(property.condo)}</span></div>
                    <div className="flex justify-between"><span>IPTU Mensal</span> <span>{formatCurrency(property.iptu)}</span></div>
                 </div>
              </div>
              <div className="bg-[#0A1929] p-6 md:p-12 rounded-sm shadow-2xl relative overflow-hidden">
                <div className="mb-6 md:mb-10">
                  <p className="text-white text-[13px] md:text-[14px] font-light leading-tight">Quer saber mais</p>
                  <p className="text-[#AF9042] text-[13px] md:text-[14px] font-light leading-tight">sobre este imóvel?</p>
                </div>
                <div className="space-y-4 md:space-y-6 mb-8 md:mb-12">
                  <button onClick={openWhatsAppInfo} className="w-full bg-[#AF9042] text-white py-4 md:py-6 text-[9px] md:text-[10px] font-light uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-white hover:text-[#0A1929] transition-all flex items-center justify-center gap-2 md:gap-3 shadow-xl border border-[#AF9042]">
                    <FaWhatsapp size={16} className="md:w-[18px] md:h-[18px]" /> Quero Saber Mais
                  </button>
                  <button onClick={openWhatsAppSchedule} className="w-full border border-white/20 text-white py-4 md:py-6 text-[9px] md:text-[10px] font-light uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-white/10 transition-all flex items-center justify-center gap-2 md:gap-3">
                    <Calendar size={14} strokeWidth={1} className="text-[#AF9042] md:w-4 md:h-4" /> Agendar Visita
                  </button>
                </div>
                <div className="pt-6 md:pt-10 border-t border-white/10 flex items-center gap-4 md:gap-6">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 flex items-center justify-center border border-white/10 grayscale opacity-40 flex-shrink-0">
                    <ShieldCheck size={20} className="md:w-6 md:h-6 text-[#AF9042]" strokeWidth={1} />
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] font-light uppercase tracking-widest text-[#AF9042] mb-1">Especialista Rava</p>
                    <p className="text-[10px] md:text-[11px] font-light text-white/50 italic tracking-wide">Consultoria Bilíngue 24/7</p>
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